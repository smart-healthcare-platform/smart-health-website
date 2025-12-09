"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { formatDateTime } from "@/lib/format"
import { LabTestResult } from "@/types/examnation"

interface LabResultsViewProps {
  result: LabTestResult
}

const testFields = [
  "bloodSugar",
  "cholesterolTotal",
  "hdl",
  "ldl",
  "triglycerides",
  "creatinine",
  "urineProtein",
  "urinePH",
  "urineSugar",
]

export function LabResultsView({ result }: LabResultsViewProps) {
  return (
    <div className="space-y-6">
      {/* Ngày nhập kết quả */}
      {result.createdAt && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ngày nhập kết quả</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-muted-foreground">
              {formatDateTime(result.createdAt)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Chỉ số xét nghiệm */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kết quả xét nghiệm</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {testFields
            .filter(
              (field) =>
                result[field as keyof LabTestResult] !== null &&
                result[field as keyof LabTestResult] !== undefined
            )
            .map((field) => (
              <div key={field}>
                <Label className="capitalize text-sm text-muted-foreground">
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </Label>
                <p className="font-medium">{String(result[field as keyof LabTestResult])}</p>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Nhận xét chung */}
      {result.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nhận xét chung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground">{result.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
