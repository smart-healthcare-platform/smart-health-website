import { NextResponse } from "next/server"

// Định nghĩa kiểu dữ liệu cho request body từ frontend
interface HealthMetrics {
  age: string
  gender: "M" | "F"
  chestPainType: string
  restingBP: string
  cholesterol: string
  fastingBS: "0" | "1"
  restingECG: string
  maxHR: string
  exerciseAngina: "Y" | "N"
  oldpeak: string
  stSlope: string
  ca: string
  thal: string
}

// Định nghĩa kiểu dữ liệu cho response từ service dự đoán Python
interface PredictionServiceResponse {
  prediction: number[]
}

// Hàm chuyển đổi dữ liệu từ frontend sang định dạng mà model yêu cầu
function transformMetricsToModelInput(metrics: HealthMetrics): number[] {
  const gender = metrics.gender === "M" ? 1 : 0
  const exerciseAngina = metrics.exerciseAngina === "Y" ? 1 : 0

  const chestPainTypeMap: { [key: string]: number } = {
    "0": 0, // Typical Angina
    "1": 1, // Atypical Angina
    "2": 2, // Non-anginal Pain
    "3": 3, // Asymptomatic
  }
  const chestPainType = chestPainTypeMap[metrics.chestPainType]

  const restingECGMap: { [key: string]: number } = {
    "Normal": 1,
    "ST": 2,
    "LVH": 0,
  }
  const restingECG = restingECGMap[metrics.restingECG]

  const stSlopeMap: { [key: string]: number } = {
    "0": 0, // Upsloping
    "1": 1, // Flat
    "2": 2, // Downsloping
  }
  const stSlope = stSlopeMap[metrics.stSlope]

  // Thứ tự các trường phải khớp với thứ tự mà mô hình AI đã được huấn luyện
  return [
    parseFloat(metrics.age),
    gender,
    chestPainType,
    parseFloat(metrics.restingBP),
    parseFloat(metrics.cholesterol),
    parseFloat(metrics.fastingBS),
    restingECG,
    parseFloat(metrics.maxHR),
    exerciseAngina,
    parseFloat(metrics.oldpeak),
    stSlope,
    parseFloat(metrics.ca),
    parseFloat(metrics.thal), // This should already be a number from the select value
  ]
}

// Hàm xử lý request POST
export async function POST(request: Request) {
  try {
    const body: HealthMetrics = await request.json()

    // Chuyển đổi dữ liệu
    const modelInput = transformMetricsToModelInput(body)

    // Gọi đến service dự đoán Python
    const predictionResponse = await fetch("http://localhost:8001/api/v1/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input_data: modelInput }),
    })

    if (!predictionResponse.ok) {
      const errorText = await predictionResponse.text()
      console.error("Prediction service error:", errorText)
      throw new Error(`Prediction service failed with status ${predictionResponse.status}`)
    }

    const predictionData: PredictionServiceResponse = await predictionResponse.json()
    // Invert the prediction: model predicts probability of NO heart disease.
    // So, risk = 1 - prediction.
    const riskPercentage = Math.round((1 - predictionData.prediction[0]) * 100)

    let riskLevel: "low" | "medium" | "high"
    if (riskPercentage < 30) {
      riskLevel = "low"
    } else if (riskPercentage < 60) {
      riskLevel = "medium"
    } else {
      riskLevel = "high"
    }

    // Tạo kết quả trả về cho frontend
    // (Các khuyến nghị và yếu tố chính có thể được tùy chỉnh thêm ở đây)
    const result = {
      riskLevel,
      riskPercentage,
      recommendations: [
        "Duy trì chế độ ăn uống lành mạnh, ít muối và chất béo bão hòa.",
        "Tập thể dục đều đặn, ít nhất 150 phút mỗi tuần.",
        "Kiểm tra huyết áp và cholesterol định kỳ.",
        "Tránh hút thuốc và hạn chế rượu bia.",
        "Quản lý căng thẳng hiệu quả.",
      ],
      keyFactors: ["Tuổi", "Huyết áp", "Cholesterol", "Nhịp tim tối đa"],
      explanation: `Dựa trên các chỉ số bạn cung cấp, hệ thống AI của chúng tôi ước tính nguy cơ mắc bệnh tim của bạn là ${riskPercentage}%. Đây là mức ${riskLevel === "low" ? "thấp" : riskLevel === "medium" ? "trung bình" : "cao"}.`,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}