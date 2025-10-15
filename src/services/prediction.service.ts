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

const PREDICTION_BASE_URL = "prediction";

export const predictionService = {
  /**
   * Gửi dữ liệu sức khỏe để dự đoán nguy cơ tim mạch
   * @param metrics Dữ liệu sức khỏe của người dùng
   * @returns Kết quả dự đoán từ AI
   */
 predict: async (metrics: HealthMetrics): Promise<PredictionResponse> => {
    const response = await apiNoAuth.post(`${PREDICTION_BASE_URL}/predict`, {
      input_data: transformMetricsToModelInput(metrics),
    });
    return response.data;
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
    Normal: 1,
    ST: 2,
    LVH: 0,
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