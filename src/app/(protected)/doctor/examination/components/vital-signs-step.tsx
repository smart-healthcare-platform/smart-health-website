"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Activity, Heart, Thermometer, Weight, Ruler, Droplets } from "lucide-react"
import type {VitalSignsStepProps } from "@/types/examination"
import { VitalSigns } from "@/types/examnation"

export function VitalSignsStep({ data, onUpdate, onNext, onPrevious }: VitalSignsStepProps) {
  const [formData, setFormData] = useState<VitalSigns>(data || {})

  useEffect(() => {
    if (formData.weight != null && formData.height != null && formData.height > 0) {
      const heightInMeters = formData.height / 100
      const bmi = formData.weight / (heightInMeters * heightInMeters)
      handleChange("bmi", Math.round(bmi * 10) / 10)
    } else {
      handleChange("bmi", "")
    }
  }, [formData.weight, formData.height])

  const handleChange = (field: keyof VitalSigns, value: string | number) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onUpdate(newData)
  }

  const handleSubmit = () => {
    onNext()
  }

  // --- Trạng thái BMI ---
  const getBMIStatus = (bmi?: number) => {
    if (!bmi) return null
    if (bmi < 18.5) return { label: "Thiếu cân", variant: "secondary" as const }
    if (bmi < 25) return { label: "Bình thường", variant: "default" as const }
    if (bmi < 30) return { label: "Thừa cân", variant: "secondary" as const }
    return { label: "Béo phì", variant: "destructive" as const }
  }

  const bmiStatus = formData.bmi != null ? getBMIStatus(formData.bmi) : null

  const isFormValid =
    formData.systolicPressure &&
    formData.diastolicPressure &&
    formData.temperature &&
    formData.oxygenSaturation &&
    formData.weight &&
    formData.height
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-balance">Đo lường và sinh hiệu</h2>
        <p className="text-sm text-muted-foreground text-pretty">
          Nhập các chỉ số đo được từ bệnh nhân
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* --- Huyết áp --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="systolic">Tâm thu (mmHg)</Label>
            <Input
              id="systolic"
              type="number"
              placeholder="120"
              value={formData.systolicPressure || ""}
              onChange={(e) =>
                handleChange(
                  "systolicPressure",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diastolic">Tâm trương (mmHg)</Label>
            <Input
              id="diastolic"
              type="number"
              placeholder="80"
              value={formData.diastolicPressure || ""}
              onChange={(e) =>
                handleChange(
                  "diastolicPressure",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            />
          </div>
        </div>

        {/* --- Nhiệt độ --- */}
        <div className="space-y-2">
          <Label htmlFor="temperature" className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            Nhiệt độ (°C)
          </Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            placeholder="VD: 36.5"
            value={formData.temperature || ""}
            onChange={(e) =>
              handleChange("temperature", e.target.value ? Number(e.target.value) : "")
            }
          />
        </div>

        {/* --- SpO2 --- */}
        <div className="space-y-2">
          <Label htmlFor="oxygenSaturation" className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-primary" />
            SpO₂ (%)
          </Label>
          <Input
            id="oxygenSaturation"
            type="number"
            placeholder="VD: 98"
            value={formData.oxygenSaturation || ""}
            onChange={(e) =>
              handleChange("oxygenSaturation", e.target.value ? Number(e.target.value) : "")
            }
          />
        </div>

        {/* --- Cân nặng & Chiều cao cùng hàng --- */}
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-primary" />
                Cân nặng (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="VD: 65"
                value={formData.weight || ""}
                onChange={(e) =>
                  handleChange("weight", e.target.value ? Number(e.target.value) : "")
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-primary" />
                Chiều cao (cm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="VD: 170"
                value={formData.height || ""}
                onChange={(e) =>
                  handleChange("height", e.target.value ? Number(e.target.value) : "")
                }
              />
            </div>
          </div>

          {/* --- Hiển thị BMI --- */}
          {formData.bmi && (
            <div className="p-3 rounded-lg bg-muted flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chỉ số BMI</p>
                <p className="text-2xl font-bold">{formData.bmi}</p>
              </div>
              {bmiStatus && <Badge variant={bmiStatus.variant}>{bmiStatus.label}</Badge>}
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* --- Ghi chú --- */}
      <div className="space-y-2">
        <Label htmlFor="notes">Ghi chú thêm</Label>
        <Textarea
          id="notes"
          placeholder="Ghi chú về các chỉ số đo được hoặc tình trạng bệnh nhân..."
          rows={3}
          value={formData.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>

      {/* --- Nút điều hướng --- */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Quay lại
        </Button>
        <Button onClick={handleSubmit}
        // disabled={!isFormValid}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  )
}
