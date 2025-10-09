"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { FileText, Stethoscope, ClipboardCheck, Pill, TestTube } from "lucide-react"
import type { ExaminationStepProps } from "@/types/examination"

export function ExaminationStep({ data, onUpdate, onNext, onPrevious }: ExaminationStepProps) {
  const [formData, setFormData] = useState(data)

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onUpdate(newData)
  }

  const handleSubmit = () => {
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-balance">Khám bệnh và chẩn đoán</h2>
        <p className="text-sm text-muted-foreground text-pretty">Ghi chú quá trình khám, chẩn đoán và kê đơn thuốc</p>
      </div>

      {/* Chief Complaint */}
      <div className="space-y-2">
        <Label htmlFor="chiefComplaint" className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Lý do khám chính
        </Label>
        <Textarea
          id="chiefComplaint"
          placeholder="Bệnh nhân đến khám vì..."
          rows={2}
          value={formData.chiefComplaint || ""}
          onChange={(e) => handleChange("chiefComplaint", e.target.value)}
        />
      </div>

      {/* Symptoms */}
      <div className="space-y-2">
        <Label htmlFor="symptoms" className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Triệu chứng
        </Label>
        <Textarea
          id="symptoms"
          placeholder="Mô tả các triệu chứng bệnh nhân đang gặp phải..."
          rows={3}
          value={formData.symptoms || ""}
          onChange={(e) => handleChange("symptoms", e.target.value)}
        />
      </div>

      <Separator />

      {/* Physical Examination */}
      <div className="space-y-2">
        <Label htmlFor="examination" className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-primary" />
          Kết quả khám lâm sàng
        </Label>
        <Textarea
          id="examination"
          placeholder="Ghi chú kết quả khám lâm sàng: tim mạch, hô hấp, bụng..."
          rows={4}
          value={formData.examination || ""}
          onChange={(e) => handleChange("examination", e.target.value)}
        />
      </div>

      <Separator />

      {/* Diagnosis */}
      <div className="space-y-2">
        <Label htmlFor="diagnosis" className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-primary" />
          Chẩn đoán
        </Label>
        <Textarea
          id="diagnosis"
          placeholder="Chẩn đoán bệnh (có thể bao gồm mã ICD-10)..."
          rows={3}
          value={formData.diagnosis || ""}
          onChange={(e) => handleChange("diagnosis", e.target.value)}
        />
      </div>

      {/* Lab Tests */}
      <div className="space-y-2">
        <Label htmlFor="labTests" className="flex items-center gap-2">
          <TestTube className="w-4 h-4 text-primary" />
          Xét nghiệm cần làm (nếu có)
        </Label>
        <Textarea
          id="labTests"
          placeholder="Danh sách các xét nghiệm cần thực hiện..."
          rows={2}
          value={formData.labTests || ""}
          onChange={(e) => handleChange("labTests", e.target.value)}
        />
      </div>

      <Separator />

      {/* Prescription */}
      <div className="space-y-2">
        <Label htmlFor="prescription" className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-primary" />
          Đơn thuốc
        </Label>
        <Textarea
          id="prescription"
          placeholder="Kê đơn thuốc: tên thuốc, liều lượng, cách dùng..."
          rows={5}
          value={formData.prescription || ""}
          onChange={(e) => handleChange("prescription", e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Quay lại
        </Button>
        <Button onClick={handleSubmit}>Tiếp tục</Button>
      </div>
    </div>
  )
}
