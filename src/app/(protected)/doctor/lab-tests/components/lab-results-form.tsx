"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { LabTestOrder, LabTestResult } from "@/types/examnation"
import { LabTestType } from "@/types/examnation/enums/lab-test-type.enum"
import { LabTestOrderResponse } from "@/types/examnation/response/lab-test.response"
import { appointmentService } from "@/services/appointment.service"
import SuccessDialog from "@/components/ui/success-dialog"
import type { RootState } from "@/redux"
import { useSelector } from "react-redux"
import ErrorDialog from "@/components/ui/error-dialog"
import { LabTestOrderStatus } from "@/types/examnation/enums/lab-test-order-status.enum"
import ConfirmDialog from "@/components/ui/confirm-dialog"
interface LabResultsFormProps {
    order: LabTestOrderResponse
    onUpdateOrder: (order: LabTestOrderResponse) => void
}

export function LabResultsForm({ order, onUpdateOrder }: LabResultsFormProps) {
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successOpen, setSuccessOpen] = useState(false)
    const [errorOpen, setErrorOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    // Thay onSubmit trực tiếp bằng open confirm dialog
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setConfirmOpen(true)
    }
    const { user } = useSelector((state: RootState) => state.auth)

    type LabTestResultFormData = Omit<
        LabTestResult,
        "id" | "medicalRecordId" | "createdAt" | "updatedAt"
    >

    const [formData, setFormData] = useState<LabTestResultFormData>({
        labTestOrderId: order.id,
        summary: "",
        enteredBy: user?.referenceId,
    })

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value === "" ? undefined : value,
        }))
    }

    const handleConfirmSubmit = async () => {
        setConfirmOpen(false)
        setLoading(true)
        setError(null)

        try {
            const result = await appointmentService.createLabTestResult(formData)
            setSubmitted(true)
            setSuccessOpen(true)

            onUpdateOrder({
                ...order,
                result,
                status: LabTestOrderStatus.COMPLETED,
            })
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Không thể lưu kết quả xét nghiệm.")
            setErrorOpen(true)
        } finally {
            setLoading(false)
        }
    }


    const isBloodTest = order.type === LabTestType.BLOOD
    const isUrineTest = order.type === LabTestType.URINE

    return (
        <>
            <form className="space-y-6" onSubmit={handleFormSubmit}>
                {/* Success Alert */}
                {submitted && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Kết quả xét nghiệm đã được lưu thành công!
                        </AlertDescription>
                    </Alert>
                )}

                {/* Error Alert */}
                {error && (
                    <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                )}

                {/* Blood Test Fields */}
                {isBloodTest && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Chỉ số xét nghiệm máu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: "bloodSugar", label: "Đường huyết (mg/dL)", placeholder: "70-100" },
                                    { id: "cholesterolTotal", label: "Cholesterol tổng (mg/dL)", placeholder: "< 200" },
                                    { id: "hdl", label: "HDL (mg/dL)", placeholder: "> 40" },
                                    { id: "ldl", label: "LDL (mg/dL)", placeholder: "< 130" },
                                    { id: "triglycerides", label: "Triglycerides (mg/dL)", placeholder: "< 150" },
                                    { id: "creatinine", label: "Creatinine (mg/dL)", placeholder: "0.6-1.2" },
                                ].map((f) => (
                                    <div key={f.id} className="space-y-2">
                                        <Label htmlFor={f.id}>{f.label}</Label>
                                        <Input
                                            id={f.id}
                                            type="number"
                                            step="0.1"
                                            placeholder={f.placeholder}
                                            value={formData[f.id as keyof typeof formData] || ""}
                                            onChange={(e) =>
                                                handleInputChange(f.id, e.target.value ? Number.parseFloat(e.target.value) : "")
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Urine Test Fields */}
                {isUrineTest && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Chỉ số xét nghiệm nước tiểu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: "urineProtein", label: "Protein (mg/dL)", placeholder: "0-trace" },
                                    { id: "urinePH", label: "pH", placeholder: "4.5-8.0" },
                                    { id: "urineSugar", label: "Glucose (mg/dL)", placeholder: "0-trace" },
                                ].map((f) => (
                                    <div key={f.id} className="space-y-2">
                                        <Label htmlFor={f.id}>{f.label}</Label>
                                        <Input
                                            id={f.id}
                                            type="number"
                                            step="0.1"
                                            placeholder={f.placeholder}
                                            value={formData[f.id as keyof typeof formData] || ""}
                                            onChange={(e) =>
                                                handleInputChange(f.id, e.target.value ? Number.parseFloat(e.target.value) : "")
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Summary Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Tóm tắt và ghi chú</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="summary" className="mb-2 block">
                            Nhận xét chung
                        </Label>
                        <Textarea
                            id="summary"
                            placeholder="Nhập nhận xét hoặc ghi chú về kết quả xét nghiệm..."
                            rows={4}
                            value={formData.summary || ""}
                            onChange={(e) => handleInputChange("summary", e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-3">
                    <Button type="submit" className="flex-1" disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? "Đang lưu..." : "Lưu kết quả xét nghiệm"}
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 bg-transparent">
                        Hủy
                    </Button>
                </div>
            </form>
            <SuccessDialog
                open={successOpen}
                onClose={() => {
                    setSuccessOpen(false)
                }}
                title="Lưu kết quả xét nghiệm thành công"
                message="Thông tin các kết quả xét nghiệm đã được lưu thành công vào hệ thống."
                confirmText="Quay lại danh sách"
                onConfirm={() => {
                    setSuccessOpen(false)
                }}
            />

            {/* <ErrorDialog
                open={errorOpen}
                onClose={() => setErrorOpen(false)}
                message={error || "Đã xảy ra lỗi khi lưu kết quả xét nghiệm. Vui lòng thử lại."}
                onRetry={() => {
                    setErrorOpen(false)
                    handleSubmit(new Event("submit") as unknown as React.FormEvent)
                }}
            /> */}

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmSubmit}
                title="Xác nhận lưu kết quả"
                description="Bạn có chắc chắn muốn lưu kết quả xét nghiệm? Sau khi lưu, kết quả không thể thay đổi."
                icon={<AlertCircle className="w-6 h-6 text-white" />}
                tone="warning"
            />
        </>
    )
}
