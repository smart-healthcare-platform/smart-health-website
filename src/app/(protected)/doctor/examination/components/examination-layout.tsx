"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, History, Loader2 } from "lucide-react"
import type { Appointment, AppointmentDetail } from "@/types"
import { useState } from "react"
import { appointmentService } from "@/services/appointment.service"
import AppointmentDetailDialog from "@/components/common/appointment-detail-dialog"

interface ExaminationLayoutProps {
  currentStep: 1 | 2 | 3 | 4 | 5
  onStepClick: (step: 1 | 2 | 3 | 4 | 5) => void
  children: React.ReactNode
  appointment?: Appointment
}

const steps = [
  { id: 1, label: "Xác nhận bệnh nhân", description: "Kiểm tra thông tin" },
  { id: 2, label: "Đo lường & Sinh hiệu", description: "Nhập các chỉ số" },
  { id: 3, label: "Khám & Chẩn đoán", description: "Ghi chú, đơn thuốc" },
  { id: 4, label: "Đề xuất tái khám", description: "Lịch hẹn tiếp theo" },
  { id: 5, label: "Hoàn thành", description: "Tổng kết khám bệnh" },
]

export function ExaminationLayout({ currentStep, onStepClick, children, appointment }: ExaminationLayoutProps) {
  const [previousAppointment, setPreviousAppointment] = useState<AppointmentDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const handleViewPrevious = async () => {
    if (!appointment?.followUpId && !appointment?.id) return
    setLoading(true)
    try {
      console.log(appointment.id)
      const data = await appointmentService.getPreviousAppointment(appointment.id)
      if (data) {
        setPreviousAppointment(data)
        setOpenDialog(true)
      }
    } catch (err) {
      console.error("Lỗi lấy cuộc hẹn trước:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header with Timeline */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-balance">Quy trình khám bệnh</h1>
            {appointment?.followUpId && (
              <Button
                onClick={handleViewPrevious}
                disabled={loading}
                variant="outline"
                size="sm"
                className="gap-2 whitespace-nowrap bg-transparent"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4" />}
                Xem hồ sơ lần khám trước
              </Button>
            )}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex items-start justify-between">
              {steps.map((step) => {
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep
                const isAccessible = step.id <= currentStep

                return (
                  <button
                    key={step.id}
                    onClick={() => isAccessible && onStepClick(step.id as 1 | 2 | 3 | 4 | 5)}
                    disabled={!isAccessible}
                    className={`
                      flex flex-col items-center gap-2 flex-1 group
                      ${isAccessible ? "cursor-pointer" : "cursor-not-allowed"}
                    `}
                  >
                    {/* Circle */}
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                        ${
                          isActive
                            ? "bg-primary border-primary text-primary-foreground scale-110"
                            : isCompleted
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-background border-border text-muted-foreground group-hover:border-primary/50"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
                      )}
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <div
                        className={`
                          text-sm font-medium text-balance
                          ${isActive ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground"}
                        `}
                      >
                        {step.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 text-pretty">{step.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Card className="p-6">{children}</Card>
      </div>
      <AppointmentDetailDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        appointment={previousAppointment}
        loading={loading}
        userRole="doctor"
      />
    </div>
  )
}
