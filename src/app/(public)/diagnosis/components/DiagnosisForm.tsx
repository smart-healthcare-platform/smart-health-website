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
import { Loader2, Heart } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(metrics);
  };

  const updateMetric = (key: keyof HealthMetrics, value: string) => {
    setMetrics((prev) => ({ ...prev, [key]: value }));
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
                className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-700 font-medium">
                Giới tính
              </Label>
              <Select
                value={metrics.gender}
                onValueChange={(value) => updateMetric("gender", value)}
              >
                <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-400/20">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Nam</SelectItem>
                  <SelectItem value="F">Nữ</SelectItem>
                </SelectContent>
              </Select>
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
                <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-400/20">
                  <SelectValue placeholder="Chọn loại đau ngực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Đau ngực điển hình</SelectItem>
                  <SelectItem value="1">Đau ngực không điển hình</SelectItem>
                  <SelectItem value="2">Đau không do tim</SelectItem>
                  <SelectItem value="3">Không có triệu chứng</SelectItem>
                </SelectContent>
              </Select>
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
                className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                required
              />
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
                className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fastingBS" className="text-gray-700 font-medium">
                Đường huyết lúc đói
              </Label>
              <Select
                value={metrics.fastingBS}
                onValueChange={(value) => updateMetric("fastingBS", value)}
              >
                <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-400/20">
                  <SelectValue placeholder="Chọn mức đường huyết" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{"< 120 mg/dl"}</SelectItem>
                  <SelectItem value="1">{"> 120 mg/dl"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restingECG" className="text-gray-700 font-medium">
                Điện tâm đồ nghỉ
              </Label>
              <Select
                value={metrics.restingECG}
                onValueChange={(value) => updateMetric("restingECG", value)}
              >
                <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-400/20">
                  <SelectValue placeholder="Chọn kết quả ECG" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Bình thường</SelectItem>
                  <SelectItem value="ST">Bất thường ST-T</SelectItem>
                  <SelectItem value="LVH">Phì đại thất trái</SelectItem>
                </SelectContent>
              </Select>
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
                className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                required
              />
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
                <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-400/20">
                  <SelectValue placeholder="Có đau khi tập không?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">Có</SelectItem>
                  <SelectItem value="N">Không</SelectItem>
                </SelectContent>
              </Select>
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
                className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stSlope" className="text-gray-700 font-medium">
                Độ dốc ST
              </Label>
              <Select
                value={metrics.stSlope}
                onValueChange={(value) => updateMetric("stSlope", value)}
              >
                <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-400/20">
                  <SelectValue placeholder="Chọn độ dốc ST" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tăng</SelectItem>
                  <SelectItem value="1">Phẳng</SelectItem>
                  <SelectItem value="2">Giảm</SelectItem>
                </SelectContent>
              </Select>
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
                className="border-green-200 focus:border-green-400 focus:ring-green-400/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thal" className="text-gray-700 font-medium">
                Thalassemia
              </Label>
              <Select
                value={metrics.thal}
                onValueChange={(value) => updateMetric("thal", value)}
              >
                <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-400/20">
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
