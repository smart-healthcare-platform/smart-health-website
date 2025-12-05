"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { FileText, Stethoscope, ClipboardCheck, Pill, TestTube, ChevronsUpDown, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import type { ExaminationStepProps } from "@/types/examination"
// import type { LabTest } from "@/types"
import { PrescriptionBuilder } from "./prescription-builder"
import { TemplateSelector } from "@/components/doctor/examination/TemplateSelector"
import { appointmentService } from "@/services/appointment.service"
import { LabTest } from "@/types/examnation"
import { PrescriptionTemplate } from "@/types/medicine"
import type { PrescriptionItem } from "@/types/examination"


export function ExaminationStep({ data, onUpdate, onNext, onPrevious }: ExaminationStepProps) {
  const [formData, setFormData] = useState(data)
  const [labTests, setLabTests] = useState<LabTest[]>([])
  const [open, setOpen] = useState(false)
  const [openFollowUp, setOpenFollowUp] = useState(false)

  // Sync formData with data prop when it changes (e.g., from copy prescription)
  useEffect(() => {
    console.log("📥 ExaminationStep received new data prop:", data)
    setFormData(data)
  }, [data])

  useEffect(() => {
    async function fetchLabTests() {
      const res = await appointmentService.getAllLabTests()
      setLabTests(res)
    }
    fetchLabTests()
  }, [])

  // Cập nhật formData
  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value }
    console.log(`🔄 handleChange - field: ${field}, value:`, value)
    console.log(`🔄 newData.prescriptionItems:`, newData.prescriptionItems)
    setFormData(newData)
    onUpdate(newData)
  }

  // Chọn / bỏ chọn xét nghiệm
  const handleToggleLabTest = (testId: string) => {
    const selected = formData.labTests || []
    const exists = selected.some((t: any) => t.id === testId)

    let newSelected
    if (exists) {
      newSelected = selected.filter((t: any) => t.id !== testId)
    } else {
      const test = labTests.find((t) => t.id === testId)
      if (!test) return
      newSelected = [...selected, { id: test.id, name: test.name, price: test.price, type: test.type }]
    }

    handleChange("labTests", newSelected)
  }

  const handleSubmit = () => onNext()

  const handleApplyTemplate = (template: PrescriptionTemplate) => {
    console.log("🎯 Applying template:", template)
    
    // Convert template items to PrescriptionItem format for examination flow
    const templateItems: PrescriptionItem[] = template.items.map((item) => {
      console.log("📝 Template item:", item)
      
      return {
        drugId: item.drugId.toString(), // Convert number to string
        drugName: item.drugName,
        activeIngredient: item.activeIngredient,
        strength: item.strength,
        quantity: item.durationDays || 1, // Use duration as default quantity
        dosage: item.dosage,
        duration: item.durationDays || 7,
        instructions: [item.frequency, item.timing, item.route]
          .filter(Boolean)
          .join(", ") || item.specialInstructions || "",
        notes: item.specialInstructions,
      }
    });

    console.log("✅ Converted to prescription items:", templateItems)
    
    // Update form data with BOTH prescriptionItems AND diagnosis in ONE call
    // This prevents the race condition where diagnosis update overwrites prescriptionItems
    const updates: any = { prescriptionItems: templateItems }
    if (template.diagnosis) {
      updates.diagnosis = template.diagnosis
    }
    
    const newData = { ...formData, ...updates }
    console.log("🔄 Final newData:", newData)
    setFormData(newData)
    onUpdate(newData)

    console.log("✅ Applied template:", template.templateName, "with", templateItems.length, "items");
  };

  const selectedNames =
    formData.labTests && formData.labTests.length > 0
      ? formData.labTests
        .map((t: any) => t.name)
        .filter(Boolean)
        .join(" + ") || "Chọn xét nghiệm..."
      : "Chọn xét nghiệm..."

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Khám bệnh và chẩn đoán</h2>
        <p className="text-sm text-muted-foreground">Ghi chú quá trình khám, chẩn đoán và kê đơn thuốc</p>
      </div>

      {/* Lý do khám */}
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

      {/* Triệu chứng */}
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

      {/* Kết quả khám lâm sàng */}
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

      {/* Chẩn đoán */}
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
                    const checked = formData.labTests?.some((t: any) => t.id === test.id)
                    return (
                      <CommandItem
                        key={test.id}
                        onSelect={() => handleToggleLabTest(test.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-accent"
                      >
                        <input
                          type="checkbox"
                          checked={!!formData.labTests?.some((t: any) => t.id === test.id)}
                          readOnly
                          className="w-4 h-4 accent-primary rounded"
                        />

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


      <Separator />

      {/* Đơn thuốc - NEW: Sử dụng PrescriptionBuilder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary" />
            Đơn thuốc
          </Label>
          <TemplateSelector onSelectTemplate={handleApplyTemplate} />
        </div>
        <PrescriptionBuilder
          selectedItems={formData.prescriptionItems || []}
          onUpdate={(items) => handleChange("prescriptionItems", items)}
        />
      </div>

      {/* Nút hành động */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Quay lại
        </Button>
        <Button onClick={handleSubmit}>Tiếp tục</Button>
      </div>
    </div>
  )
}
