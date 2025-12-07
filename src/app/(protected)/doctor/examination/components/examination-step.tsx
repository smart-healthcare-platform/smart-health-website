"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { FileText, Stethoscope, ClipboardCheck, Pill, TestTube, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import type { ExaminationStepData, ExaminationStepProps } from "@/types/examination"
import { PrescriptionBuilder } from "./prescription-builder"
import { appointmentService } from "@/services/appointment.service"
import { LabTest } from "@/types/examnation"

export function ExaminationStep({ data, onUpdate, onNext, onPrevious }: ExaminationStepProps) {
  const [formData, setFormData] = useState<ExaminationStepData>(data)
  const [labTests, setLabTests] = useState<LabTest[]>([])
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ExaminationStepData, string>>>({})

  useEffect(() => {
    async function fetchLabTests() {
      const res = await appointmentService.getAllLabTests()
      setLabTests(res)
    }
    fetchLabTests()
  }, [])

  // Cập nhật dữ liệu và gọi callback
  const handleChange = <K extends keyof ExaminationStepData>(field: K, value: ExaminationStepData[K]) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onUpdate(newData)
  }

  // Validate khi blur input
  const handleBlur = <K extends keyof ExaminationStepData>(field: K, value: ExaminationStepData[K]) => {
    let error = ""

    // Các trường bắt buộc
    if (["chiefComplaint", "symptoms", "examination", "diagnosis"].includes(field as string)) {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        error = "Bắt buộc nhập"
      }
    }

    // Validate diagnosis theo ICD-10
    if (field === "diagnosis" && typeof value === "string" && value.trim()) {
      const icdRegex = /^[A-TV-Z][0-9]{2}(\.[0-9A-TV-Z]{1,4})?$/
      if (!icdRegex.test(value.trim())) {
        error = "Mã ICD-10 không hợp lệ"
      }
    }

    setErrors(prev => ({ ...prev, [field]: error }))
  }

  // Toggle xét nghiệm
  const handleToggleLabTest = (testId: string) => {
    const selected = formData.labTests || []
    const exists = selected.some(t => t.id === testId)
    let newSelected
    if (exists) {
      newSelected = selected.filter(t => t.id !== testId)
    } else {
      const test = labTests.find(t => t.id === testId)
      if (!test) return
      newSelected = [...selected, { id: test.id, name: test.name, price: test.price, type: test.type }]
    }
    handleChange("labTests", newSelected)
  }

  const handleSubmit = () => onNext()

  const selectedNames =
    formData.labTests && formData.labTests.length > 0
      ? formData.labTests.map(t => t.name).filter(Boolean).join(" + ") || "Chọn xét nghiệm..."
      : "Chọn xét nghiệm..."

  const fieldLabels: Partial<Record<keyof ExaminationStepData, string>> = {
    chiefComplaint: "Lý do khám chính",
    symptoms: "Triệu chứng",
    examination: "Kết quả khám lâm sàng",
    diagnosis: "Chẩn đoán",
    labTests: "",
    prescriptionItems: "",
  }

  const fieldPlaceholders: Partial<Record<keyof ExaminationStepData, string>> = {
    chiefComplaint: "Nhập lý do bệnh nhân đến khám...",
    symptoms: "Nhập triệu chứng bệnh nhân...",
    examination: "Nhập kết quả khám lâm sàng...",
    diagnosis: "Nhập chẩn đoán bệnh (mã ICD-10)...",
    labTests: "",
    prescriptionItems: "",
  }

  const requiredFields: (keyof ExaminationStepData)[] = ["chiefComplaint", "symptoms", "examination", "diagnosis"]

  const isFormValid =
    requiredFields.every(f => formData[f] && (formData[f] as string).trim() !== "") &&
    Object.values(errors).every(e => !e)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Khám bệnh và chẩn đoán</h2>
        <p className="text-sm text-muted-foreground">Ghi chú quá trình khám, chẩn đoán và kê đơn thuốc</p>
      </div>

      {requiredFields.map((field, idx) => (
        <div key={idx} className="space-y-2">
          <Label htmlFor={field} className="flex items-center gap-2">
            {field === "chiefComplaint" && <FileText className="w-4 h-4 text-primary" />}
            {field === "symptoms" && <FileText className="w-4 h-4 text-primary" />}
            {field === "examination" && <Stethoscope className="w-4 h-4 text-primary" />}
            {field === "diagnosis" && <ClipboardCheck className="w-4 h-4 text-primary" />}
            {fieldLabels[field]}
          </Label>
          <Textarea
            id={field}
            rows={field === "examination" ? 4 : 3}
            placeholder={fieldPlaceholders[field]}
            value={(formData[field] as string) || ""}
            onChange={(e) => handleChange(field, e.target.value as typeof formData[typeof field])}
            onBlur={(e) => handleBlur(field, e.target.value as typeof formData[typeof field])}
          />
          {errors[field] && <p className="text-destructive text-sm">{errors[field]}</p>}
        </div>
      ))}

      <Separator />

      {/* Xét nghiệm */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <TestTube className="w-4 h-4 text-primary" />
          Xét nghiệm cần làm (nếu có)
        </Label>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-transparent"
            >
              <span className="truncate">{selectedNames}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto p-2">
            <Command>
              <CommandInput placeholder="Tìm xét nghiệm..." />
              <CommandList>
                <CommandEmpty>Không có kết quả</CommandEmpty>
                <CommandGroup className="mt-2 space-y-1">
                  {labTests.map((test) => {
                    const checked = formData.labTests?.some(t => t.id === test.id)
                    return (
                      <CommandItem
                        key={test.id}
                        onSelect={() => handleToggleLabTest(test.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-accent"
                      >
                        <input type="checkbox" checked={checked} readOnly className="w-4 h-4 accent-primary rounded" />
                        <span className="flex-1">{test.name}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Separator />

      {/* Đơn thuốc */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-primary" />
          Đơn thuốc
        </Label>
        <PrescriptionBuilder
          selectedItems={formData.prescriptionItems || []}
          onUpdate={(items) => handleChange("prescriptionItems", items)}
        />
      </div>

      {/* Nút điều hướng */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>Quay lại</Button>
        <Button onClick={handleSubmit} disabled={!isFormValid}>Tiếp tục</Button>
      </div>
    </div>
  )
}
