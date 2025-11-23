"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Heart, AlertCircle } from "lucide-react";
import { predictionService } from "@/services/prediction.service";

interface HealthMetrics {
  age: string;
  gender: string;
  chestPainType: string;
  restingBP: string;
  cholesterol: string;
  fastingBS: string;
  restingECG: string;
  maxHR: string;
  exerciseAngina: string;
  oldpeak: string;
  stSlope: string;
  ca: string;
  thal: string;
}

interface DiagnosisResult {
  riskLevel: "low" | "medium" | "high";
  riskPercentage: number;
  recommendations: string[];
  keyFactors: string[];
  explanation: string;
}

interface ValidationErrors {
  age?: string;
  gender?: string;
  chestPainType?: string;
  restingBP?: string;
  cholesterol?: string;
  fastingBS?: string;
  restingECG?: string;
  maxHR?: string;
  exerciseAngina?: string;
  oldpeak?: string;
  stSlope?: string;
  ca?: string;
  thal?: string;
}

interface HealthMetricsFormProps {
  onSubmit: (metrics: HealthMetrics) => void;
  isLoading: boolean;
}

export function HealthMetricsForm({
  onSubmit,
  isLoading,
}: HealthMetricsFormProps) {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    age: "",
    gender: "",
    chestPainType: "",
    restingBP: "",
    cholesterol: "",
    fastingBS: "",
    restingECG: "",
    maxHR: "",
    exerciseAngina: "",
    oldpeak: "",
    stSlope: "",
    ca: "",
    thal: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (key: keyof HealthMetrics, value: string): string | undefined => {
    if (!value.trim()) {
      return "Trường này là bắt buộc";
    }

    const numValue = parseFloat(value);
    switch (key) {
      case "age":
        if (isNaN(numValue) || numValue < 0 || numValue > 120) {
          return "Tuổi phải từ 0 đến 120";
        }
        break;
      case "restingBP":
        if (isNaN(numValue) || numValue < 80 || numValue > 200) {
          return "Huyết áp phải từ 80 đến 200 mmHg";
        }
        break;
      case "cholesterol":
        if (isNaN(numValue) || numValue < 100 || numValue > 600) {
          return "Cholesterol phải từ 100 đến 600 mg/dl";
        }
        break;
      case "maxHR":
        if (isNaN(numValue) || numValue < 60 || numValue > 220) {
          return "Nhịp tim phải từ 60 đến 220 bpm";
        }
        break;
      case "oldpeak":
        if (isNaN(numValue) || numValue < 0 || numValue > 6.2) {
          return "Oldpeak phải từ 0 đến 6.2";
        }
        break;
      case "ca":
        if (isNaN(numValue) || numValue < 0 || numValue > 3) {
          return "Số lượng mạch chính phải từ 0 đến 3";
        }
        break;
      default:
        break;
    }
    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: ValidationErrors = {};
    Object.keys(metrics).forEach((key) => {
      const error = validateField(key as keyof HealthMetrics, metrics[key as keyof HealthMetrics]);
      if (error) {
        newErrors[key as keyof ValidationErrors] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(metrics);
    }
  };

  const updateMetric = (key: keyof HealthMetrics, value: string) => {
    setMetrics((prev) => ({ ...prev, [key]: value }));

    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleBlur = (key: keyof HealthMetrics) => {
    const error = validateField(key, metrics[key]);
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  return (
    <Card className="w-full border-green-200/50 shadow-lg bg-white backdrop-blur-sm overflow-hidden">
      <div className="bg-green-600 px-6 py-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div>
        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-xl font-semibold text-white mb-2">
            <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
              <Heart className="h-5 w-5" />
            </div>
            Nhập thông tin sức khỏe
          </div>
          <p className="text-white font-medium">
            Vui lòng điền đầy đủ các thông tin để có kết quả chính xác nhất
          </p>
        </div>
      </div>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-gray-700 font-medium">
                Tuổi
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Nhập tuổi"
                value={metrics.age}
                onChange={(e) => updateMetric("age", e.target.value)}
                onBlur={() => handleBlur("age")}
                className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.age ? "border-red-500" : ""}`}
                min="0"
                max="120"
                required
              />
              {errors.age && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.age}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-700 font-medium">
                Giới tính
              </Label>
              <Select
                value={metrics.gender}
                onValueChange={(value) => updateMetric("gender", value)}
              >
                <SelectTrigger className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.gender ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Nam</SelectItem>
                  <SelectItem value="F">Nữ</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gender}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="chestPainType"
                className="text-gray-700 font-medium"
              >
                Loại đau ngực
              </Label>
              <Select
                value={metrics.chestPainType}
                onValueChange={(value) => updateMetric("chestPainType", value)}
              >
                <SelectTrigger className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.chestPainType ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Chọn loại đau ngực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Đau ngực điển hình</SelectItem>
                  <SelectItem value="1">Đau ngực không điển hình</SelectItem>
                  <SelectItem value="2">Đau không do tim</SelectItem>
                  <SelectItem value="3">Không có triệu chứng</SelectItem>
                </SelectContent>
              </Select>
              {errors.chestPainType && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.chestPainType}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="restingBP" className="text-gray-700 font-medium">
                Huyết áp nghỉ (mmHg)
              </Label>
              <Input
                id="restingBP"
                type="number"
                placeholder="120"
                value={metrics.restingBP}
                onChange={(e) => updateMetric("restingBP", e.target.value)}
                onBlur={() => handleBlur("restingBP")}
                className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.restingBP ? "border-red-500" : ""}`}
                min="80"
                max="200"
                required
              />
              {errors.restingBP && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.restingBP}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="cholesterol"
                className="text-gray-700 font-medium"
              >
                Cholesterol (mg/dl)
              </Label>
              <Input
                id="cholesterol"
                type="number"
                placeholder="200"
                value={metrics.cholesterol}
                onChange={(e) => updateMetric("cholesterol", e.target.value)}
                onBlur={() => handleBlur("cholesterol")}
                className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.cholesterol ? "border-red-500" : ""}`}
                min="100"
                max="600"
                required
              />
              {errors.cholesterol && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cholesterol}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fastingBS" className="text-gray-700 font-medium">
                Đường huyết lúc đói
              </Label>
              <Select
                value={metrics.fastingBS}
                onValueChange={(value) => updateMetric("fastingBS", value)}
              >
                <SelectTrigger className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.fastingBS ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Chọn mức đường huyết" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{"< 120 mg/dl"}</SelectItem>
                  <SelectItem value="1">{"> 120 mg/dl"}</SelectItem>
                </SelectContent>
              </Select>
              {errors.fastingBS && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fastingBS}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="restingECG" className="text-gray-700 font-medium">
                Điện tâm đồ nghỉ
              </Label>
              <Select
                value={metrics.restingECG}
                onValueChange={(value) => updateMetric("restingECG", value)}
              >
                <SelectTrigger className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.restingECG ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Chọn kết quả ECG" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Bình thường</SelectItem>
                  <SelectItem value="ST">Bất thường ST-T</SelectItem>
                  <SelectItem value="LVH">Phì đại thất trái</SelectItem>
                </SelectContent>
              </Select>
              {errors.restingECG && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.restingECG}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxHR" className="text-gray-700 font-medium">
                Nhịp tim tối đa
              </Label>
              <Input
                id="maxHR"
                type="number"
                placeholder="150"
                value={metrics.maxHR}
                onChange={(e) => updateMetric("maxHR", e.target.value)}
                onBlur={() => handleBlur("maxHR")}
                className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.maxHR ? "border-red-500" : ""}`}
                min="60"
                max="220"
                required
              />
              {errors.maxHR && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.maxHR}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="exerciseAngina"
                className="text-gray-700 font-medium"
              >
                Đau thắt ngực khi tập
              </Label>
              <Select
                value={metrics.exerciseAngina}
                onValueChange={(value) => updateMetric("exerciseAngina", value)}
              >
                <SelectTrigger className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.exerciseAngina ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Có đau khi tập không?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">Có</SelectItem>
                  <SelectItem value="N">Không</SelectItem>
                </SelectContent>
              </Select>
              {errors.exerciseAngina && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.exerciseAngina}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldpeak" className="text-gray-700 font-medium">
                Oldpeak (ST depression)
              </Label>
              <Input
                id="oldpeak"
                type="number"
                step="0.1"
                placeholder="1.0"
                value={metrics.oldpeak}
                onChange={(e) => updateMetric("oldpeak", e.target.value)}
                onBlur={() => handleBlur("oldpeak")}
                className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.oldpeak ? "border-red-500" : ""}`}
                min="0"
                max="6.2"
                required
              />
              {errors.oldpeak && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.oldpeak}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stSlope" className="text-gray-700 font-medium">
                Độ dốc ST
              </Label>
              <Select
                value={metrics.stSlope}
                onValueChange={(value) => updateMetric("stSlope", value)}
              >
                <SelectTrigger className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.stSlope ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Chọn độ dốc ST" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tăng</SelectItem>
                  <SelectItem value="1">Phẳng</SelectItem>
                  <SelectItem value="2">Giảm</SelectItem>
                </SelectContent>
              </Select>
              {errors.stSlope && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.stSlope}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ca" className="text-gray-700 font-medium">
                Số lượng mạch chính (0-3)
              </Label>
              <Input
                id="ca"
                type="number"
                placeholder="0"
                value={metrics.ca}
                onChange={(e) => updateMetric("ca", e.target.value)}
                onBlur={() => handleBlur("ca")}
                className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.ca ? "border-red-500" : ""}`}
                min="0"
                max="3"
                required
              />
              {errors.ca && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.ca}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thal" className="text-gray-700 font-medium">
                Thalassemia
              </Label>
              <Select
                value={metrics.thal}
                onValueChange={(value) => updateMetric("thal", value)}
              >
                <SelectTrigger className={`border-green-200 focus:border-green-400 focus:ring-green-400/20 ${errors.thal ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Chọn loại Thalassemia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Không có</SelectItem>
                  <SelectItem value="1">Bình thường</SelectItem>
                  <SelectItem value="2">Khiếm khuyết cố định</SelectItem>
                  <SelectItem value="3">
                    Khiếm khuyết có thể đảo ngược
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.thal && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.thal}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                Đang phân tích...
              </>
            ) : (
              "Phân tích nguy cơ tim mạch"
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
