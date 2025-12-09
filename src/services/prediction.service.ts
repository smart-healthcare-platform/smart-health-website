import { apiNoAuth } from "@/lib/axios";

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

interface PredictionResponse {
  prediction: number[];
}

interface DiagnosisResult {
  riskLevel: "low" | "medium" | "high";
  riskPercentage: number;
  recommendations: string[];
  keyFactors: string[];
  explanation: string;
}

const PREDICTION_BASE_URL = "prediction";

export const predictionService = {
  /**
   * Gửi dữ liệu sức khỏe để dự đoán nguy cơ tim mạch và trả về kết quả chẩn đoán đầy đủ
   * @param metrics Dữ liệu sức khỏe của người dùng
   * @returns Kết quả chẩn đoán với mức độ rủi ro và khuyến nghị
   */
 predict: async (metrics: HealthMetrics): Promise<DiagnosisResult> => {
    const response = await apiNoAuth.post<PredictionResponse>(`${PREDICTION_BASE_URL}/predict`, {
      input_data: transformMetricsToModelInput(metrics),
    });

    const predictionData = response.data;

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

    // Tạo kết quả trả về
    const result: DiagnosisResult = {
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

    return result;
  },

 /**
  * Lấy thông tin về mô hình dự đoán (nếu có endpoint này)
  * @returns Thông tin mô hình
  */
 getHealthInfo: async (): Promise<{ message: string }> => {
   const response = await apiNoAuth.get(`${PREDICTION_BASE_URL}/health`);
   return response.data;
 },
};

// Hàm chuyển đổi dữ liệu từ frontend sang định dạng mà model yêu cầu
function transformMetricsToModelInput(metrics: HealthMetrics): number[] {
  const gender = metrics.gender === "M" ? 1 : 0;
  const exerciseAngina = metrics.exerciseAngina === "Y" ? 1 : 0;

  const chestPainTypeMap: { [key: string]: number } = {
    "0": 0, // Typical Angina
    "1": 1, // Atypical Angina
    "2": 2, // Non-anginal Pain
    "3": 3, // Asymptomatic
  };
  const chestPainType = chestPainTypeMap[metrics.chestPainType];

  const restingECGMap: { [key: string]: number } = {
    Normal: 0,
    ST: 1,
    LVH: 2,
  };
  const restingECG = restingECGMap[metrics.restingECG];

  const stSlopeMap: { [key: string]: number } = {
    "0": 0, // Upsloping
    "1": 1, // Flat
    "2": 2, // Downsloping
  };
 const stSlope = stSlopeMap[metrics.stSlope];

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
  ];
}
