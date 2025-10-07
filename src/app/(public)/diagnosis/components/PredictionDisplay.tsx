"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface DiagnosisResult {
  riskLevel: "low" | "medium" | "high"
  riskPercentage: number
  recommendations: string[]
  keyFactors: string[]
  explanation: string
}

interface AIResultsDisplayProps {
  result: DiagnosisResult | null
}

export function AIResultsDisplay({ result }: AIResultsDisplayProps) {
  if (!result) return null

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "high":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="h-5 w-5" />
      case "medium":
        return <Info className="h-5 w-5" />
      case "high":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Heart className="h-5 w-5" />
    }
  }

  const getRiskText = (level: string) => {
    switch (level) {
      case "low":
        return "Nguy cơ thấp"
      case "medium":
        return "Nguy cơ trung bình"
      case "high":
        return "Nguy cơ cao"
      default:
        return "Không xác định"
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Risk Level Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Kết quả đánh giá nguy cơ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getRiskColor(result.riskLevel)}`}>
              {getRiskIcon(result.riskLevel)}
              <span className="font-semibold">{getRiskText(result.riskLevel)}</span>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{result.riskPercentage}%</div>
              <Progress value={result.riskPercentage} className="w-full max-w-md mx-auto" />
              <p className="text-sm text-muted-foreground">Xác suất mắc bệnh tim mạch dựa trên các chỉ số đã nhập</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explanation Card */}
      <Card>
        <CardHeader>
          <CardTitle>Giải thích kết quả</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
        </CardContent>
      </Card>

      {/* Key Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Yếu tố ảnh hưởng chính</CardTitle>
          <CardDescription>Các chỉ số quan trọng nhất trong đánh giá của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {result.keyFactors.map((factor, index) => (
              <Badge key={index} variant="secondary">
                {factor}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Khuyến nghị từ AI</CardTitle>
          <CardDescription>Những gợi ý để cải thiện sức khỏe tim mạch của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Lưu ý quan trọng:</strong> Kết quả này chỉ mang tính chất tham khảo và không thể thay thế cho việc
          khám bác sĩ chuyên khoa. Vui lòng tham khảo ý kiến bác sĩ để có chẩn đoán và điều trị chính xác.
        </AlertDescription>
      </Alert>
    </div>
  )
}
