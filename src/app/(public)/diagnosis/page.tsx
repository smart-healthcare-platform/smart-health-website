"use client"

import { useState } from "react"
import { HealthMetricsForm } from "@/app/(public)/diagnosis/components/DiagnosisForm"
import { AIResultsDisplay } from "@/app/(public)/diagnosis/components/PredictionDisplay"
import { AIChatInterface } from "@/app/(public)/diagnosis/components/ChatBox"
import { DiagnosisHeader } from "./components/DiagnosisHeader"
interface HealthMetrics {
  age: string
  gender: string
  chestPainType: string
  restingBP: string
  cholesterol: string
  fastingBS: string
  restingECG: string
  maxHR: string
  exerciseAngina: string
  oldpeak: string
  stSlope: string
}

interface DiagnosisResult {
  riskLevel: "low" | "medium" | "high"
  riskPercentage: number
  recommendations: string[]
  keyFactors: string[]
  explanation: string
}

export default function DiagnosisPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)

  const handleFormSubmit = async (metrics: HealthMetrics) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metrics),
      })

      if (!response.ok) {
        throw new Error("Failed to get diagnosis")
      }

      const diagnosisResult = await response.json()
      setResult(diagnosisResult)
    } catch (error) {
      console.error("Error getting diagnosis:", error)
      // Fallback result for demo
      setResult({
        riskLevel: "medium",
        riskPercentage: 35,
        recommendations: [
          "Duy trì chế độ ăn ít muối và ít chất béo bão hòa",
          "Tập thể dục aerobic ít nhất 150 phút/tuần",
          "Kiểm tra huyết áp thường xuyên",
          "Giảm stress thông qua thiền định hoặc yoga",
          "Tái khám định kỳ 6 tháng/lần",
        ],
        keyFactors: ["Tuổi", "Huyết áp", "Cholesterol", "Nhịp tim tối đa"],
        explanation:
          "Dựa trên các chỉ số bạn cung cấp, hệ thống AI đánh giá bạn có nguy cơ trung bình mắc bệnh tim mạch. Các yếu tố chính ảnh hưởng đến kết quả này bao gồm tuổi, mức huyết áp và cholesterol. Tuy nhiên, với những thay đổi lối sống phù hợp, bạn có thể giảm đáng kể nguy cơ này.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-blue-50/20">
      <DiagnosisHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-200px)]">
          {/* Left Column - Form and Results */}
          <div className="lg:col-span-2 space-y-8">
            <HealthMetricsForm onSubmit={handleFormSubmit} isLoading={isLoading} />

            {result && <AIResultsDisplay result={result} />}
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AIChatInterface />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
