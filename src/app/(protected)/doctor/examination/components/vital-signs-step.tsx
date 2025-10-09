"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Activity, Heart, Thermometer, Weight, Ruler, Droplets } from "lucide-react"
import type { VitalSigns, VitalSignsStepProps } from "@/types/examination"

export function VitalSignsStep({ data, onUpdate, onNext, onPrevious }: VitalSignsStepProps) {
    const [formData, setFormData] = useState<VitalSigns>(data || {})

    const handleChange = (field: keyof VitalSigns, value: string | number) => {
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
                <h2 className="text-xl font-semibold mb-2 text-balance">Đo lường và sinh hiệu</h2>
                <p className="text-sm text-muted-foreground text-pretty">Nhập các chỉ số đo được từ bệnh nhân</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Blood Pressure */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="systolic">Tâm thu (mmHg)</Label>
                        <Input
                            id="systolic"
                            type="number"
                            placeholder="120"
                            value={formData.bloodPressureSystolic || ""}
                            onChange={(e) => handleChange("bloodPressureSystolic", e.target.value ? Number(e.target.value) : "")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="diastolic">Tâm trương (mmHg)</Label>
                        <Input
                            id="diastolic"
                            type="number"
                            placeholder="80"
                            value={formData.bloodPressureDiastolic || ""}
                            onChange={(e) => handleChange("bloodPressureDiastolic", e.target.value ? Number(e.target.value) : "")}
                        />
                    </div>
                </div>

                {/* Temperature */}
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
                        onChange={(e) => handleChange("temperature", e.target.value ? Number(e.target.value) : "")}
                    />
                </div>

                {/* Oxygen Saturation */}
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
                        onChange={(e) => handleChange("oxygenSaturation", e.target.value ? Number(e.target.value) : "")}
                    />
                </div>

                {/* Weight */}
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
                        onChange={(e) => handleChange("weight", e.target.value ? Number(e.target.value) : "")}
                    />
                </div>

                {/* Height */}
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
                        onChange={(e) => handleChange("height", e.target.value ? Number(e.target.value) : "")}
                    />
                </div>
            </div>

            <Separator />

            {/* Notes */}
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
