"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Activity, Heart, Thermometer, Wind, Droplets, Weight, Ruler } from "lucide-react"
import type { VitalSigns } from "@/types/examination"

interface VitalSignsFormProps {
  data: VitalSigns
  onUpdate: (data: VitalSigns) => void
  onNext: () => void
  onPrevious: () => void
}

export function VitalSignsForm({ data, onUpdate, onNext, onPrevious }: VitalSignsFormProps) {
  const [formData, setFormData] = useState<VitalSigns>(data)

  useEffect(() => {
    // Calculate BMI when weight and height change
    if (formData.weight && formData.height) {
      const heightInMeters = formData.height / 100
      const bmi = formData.weight / (heightInMeters * heightInMeters)
      setFormData((prev) => ({ ...prev, bmi: Math.round(bmi * 10) / 10 }))
    }
  }, [formData.weight, formData.height])

  const handleChange = (field: keyof VitalSigns, value: string) => {
    const numValue = value === "" ? undefined : Number.parseFloat(value)
    setFormData((prev) => ({ ...prev, [field]: numValue }))
  }

  const handleSubmit = () => {
    onUpdate(formData)
    onNext()
  }

  const getBMIStatus = (bmi?: number) => {
    if (!bmi) return null
    if (bmi < 18.5) return { label: "Thiếu cân", variant: "secondary" as const }
    if (bmi < 25) return { label: "Bình thường", variant: "default" as const }
    if (bmi < 30) return { label: "Thừa cân", variant: "secondary" as const }
    return { label: "Béo phì", variant: "destructive" as const }
  }

  const getBloodPressureStatus = (systolic?: number, diastolic?: number) => {
    if (!systolic || !diastolic) return null
    if (systolic < 120 && diastolic < 80) return { label: "Bình thường", variant: "default" as const }
    if (systolic < 140 && diastolic < 90) return { label: "Tiền cao huyết áp", variant: "secondary" as const }
    return { label: "Cao huyết áp", variant: "destructive" as const }
  }

  const bmiStatus = getBMIStatus(formData.bmi)
  const bpStatus = getBloodPressureStatus(formData.bloodPressureSystolic, formData.bloodPressureDiastolic)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-balance">
            <Activity className="w-5 h-5 text-primary" />
            Chỉ số sinh tồn
          </CardTitle>
          <CardDescription className="text-pretty">
            Nhập các chỉ số sinh tồn của bệnh nhân được đo trong quá trình khám
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Blood Pressure */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Huyết áp
              </Label>
              {bpStatus && <Badge variant={bpStatus.variant}>{bpStatus.label}</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systolic">Tâm thu (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="120"
                  value={formData.bloodPressureSystolic || ""}
                  onChange={(e) => handleChange("bloodPressureSystolic", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolic">Tâm trương (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  placeholder="80"
                  value={formData.bloodPressureDiastolic || ""}
                  onChange={(e) => handleChange("bloodPressureDiastolic", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="space-y-2">
            <Label htmlFor="heartRate" className="text-base font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-pink-500" />
              Nhịp tim (lần/phút)
            </Label>
            <Input
              id="heartRate"
              type="number"
              placeholder="72"
              value={formData.heartRate || ""}
              onChange={(e) => handleChange("heartRate", e.target.value)}
            />
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <Label htmlFor="temperature" className="text-base font-semibold flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-500" />
              Nhiệt độ (°C)
            </Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              placeholder="36.5"
              value={formData.temperature || ""}
              onChange={(e) => handleChange("temperature", e.target.value)}
            />
          </div>

          {/* Respiratory Rate */}
          <div className="space-y-2">
            <Label htmlFor="respiratoryRate" className="text-base font-semibold flex items-center gap-2">
              <Wind className="w-4 h-4 text-blue-500" />
              Nhịp thở (lần/phút)
            </Label>
            <Input
              id="respiratoryRate"
              type="number"
              placeholder="16"
              value={formData.respiratoryRate || ""}
              onChange={(e) => handleChange("respiratoryRate", e.target.value)}
            />
          </div>

          {/* Oxygen Saturation */}
          <div className="space-y-2">
            <Label htmlFor="oxygenSaturation" className="text-base font-semibold flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-500" />
              SpO₂ (%)
            </Label>
            <Input
              id="oxygenSaturation"
              type="number"
              placeholder="98"
              value={formData.oxygenSaturation || ""}
              onChange={(e) => handleChange("oxygenSaturation", e.target.value)}
            />
          </div>

          {/* Weight and Height */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-base font-semibold flex items-center gap-2">
                <Weight className="w-4 h-4 text-purple-500" />
                Cân nặng (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="65"
                value={formData.weight || ""}
                onChange={(e) => handleChange("weight", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-base font-semibold flex items-center gap-2">
                <Ruler className="w-4 h-4 text-green-500" />
                Chiều cao (cm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={formData.height || ""}
                onChange={(e) => handleChange("height", e.target.value)}
              />
            </div>
          </div>

          {/* BMI Display */}
          {formData.bmi && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chỉ số BMI</p>
                  <p className="text-2xl font-bold">{formData.bmi}</p>
                </div>
                {bmiStatus && <Badge variant={bmiStatus.variant}>{bmiStatus.label}</Badge>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Quay lại
        </Button>
        <Button onClick={handleSubmit}>Tiếp tục</Button>
      </div>
    </div>
  )
}
