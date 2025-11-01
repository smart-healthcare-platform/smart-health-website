import { NextResponse } from "next/server";
import { predictionService } from "@/services/prediction.service";

// Định nghĩa kiểu dữ liệu cho request body từ frontend
interface HealthMetrics {
  age: string;
  gender: "M" | "F";
  chestPainType: string;
  restingBP: string;
  cholesterol: string;
  fastingBS: "0" | "1";
  restingECG: string;
  maxHR: string;
  exerciseAngina: "Y" | "N";
  oldpeak: string;
  stSlope: string;
  ca: string;
  thal: string;
}

// Định nghĩa kiểu dữ liệu cho response từ service dự đoán Python
interface PredictionServiceResponse {
  prediction: number[];
}

// Hàm xử lý request POST
export async function POST(request: Request) {
  try {
    const body: HealthMetrics = await request.json();

    // Gọi đến service dự đoán thông qua API Gateway
    const predictionData: PredictionServiceResponse = await predictionService.predict(body);

    // Invert the prediction: model predicts probability of NO heart disease.
    // So, risk = 1 - prediction.
    const riskPercentage = Math.round((1 - predictionData.prediction[0]) * 100);

    let riskLevel: "low" | "medium" | "high";
    if (riskPercentage < 30) {
      riskLevel = "low";
    } else if (riskPercentage < 60) {
      riskLevel = "medium";
    } else {
      riskLevel = "high";
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
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}