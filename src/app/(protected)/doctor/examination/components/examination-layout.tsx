"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

interface ExaminationLayoutProps {
  currentStep: 1 | 2 | 3 | 4 | 5
  onStepClick: (step: 1 | 2 | 3 | 4 | 5) => void
  children: React.ReactNode
}

const steps = [
  { id: 1, label: "Xác nhận bệnh nhân", description: "Kiểm tra thông tin" },
  { id: 2, label: "Đo lường & Sinh hiệu", description: "Nhập các chỉ số" },
  { id: 3, label: "Khám & Chẩn đoán", description: "Ghi chú, đơn thuốc" },
  { id: 4, label: "Đề xuất tái khám", description: "Lịch hẹn tiếp theo" },
  { id: 5, label: "Hoàn thành", description: "Tổng kết khám bệnh" },
]

export function ExaminationLayout({ currentStep, onStepClick, children }: ExaminationLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header with Timeline */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold mb-6 text-balance">Quy trình khám bệnh</h1>

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
    </div>
  )
}
