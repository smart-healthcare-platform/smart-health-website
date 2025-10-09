"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, User, Activity, FileText } from "lucide-react"
import type { SummaryStepProps } from "@/types/examination"

export function SummaryStep({ appointment, examinationData, onComplete, onPrevious }: SummaryStepProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-balance">Tổng kết khám bệnh</h2>
        <p className="text-sm text-muted-foreground text-pretty">Xem lại thông tin trước khi hoàn thành</p>
      </div>

      {/* Patient Info */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Thông tin bệnh nhân
        </h3>
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Họ tên:</span>
            <span className="font-medium">{appointment.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Ngày sinh:</span>
            <span className="font-medium">{formatDate(appointment.dateOfBirth)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Giới tính:</span>
            <span className="font-medium">{appointment.gender}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Vital Signs */}
      {examinationData.vitalSigns && (
        <>
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Sinh hiệu
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg grid grid-cols-2 gap-3">
              {/* {examinationData.vitalSigns.bloodPressure && (
                <div>
                  <span className="text-sm text-muted-foreground">Huyết áp:</span>
                  <p className="font-medium">{examinationData.vitalSigns.bloodPressure} mmHg</p>
                </div>
              )} */}
              {examinationData.vitalSigns.heartRate && (
                <div>
                  <span className="text-sm text-muted-foreground">Nhịp tim:</span>
                  <p className="font-medium">{examinationData.vitalSigns.heartRate} lần/phút</p>
                </div>
              )}
              {examinationData.vitalSigns.temperature && (
                <div>
                  <span className="text-sm text-muted-foreground">Nhiệt độ:</span>
                  <p className="font-medium">{examinationData.vitalSigns.temperature}°C</p>
                </div>
              )}
              {examinationData.vitalSigns.weight && (
                <div>
                  <span className="text-sm text-muted-foreground">Cân nặng:</span>
                  <p className="font-medium">{examinationData.vitalSigns.weight} kg</p>
                </div>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Examination Details */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Kết quả khám
        </h3>
        <div className="space-y-4">
          {examinationData.chiefComplaint && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Lý do khám:</p>
              <p className="text-sm bg-muted/50 p-3 rounded text-pretty">{examinationData.chiefComplaint}</p>
            </div>
          )}
          {examinationData.diagnosis && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Chẩn đoán:</p>
              <p className="text-sm bg-muted/50 p-3 rounded text-pretty">{examinationData.diagnosis}</p>
            </div>
          )}
          {examinationData.prescription && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Đơn thuốc:</p>
              <p className="text-sm bg-muted/50 p-3 rounded text-pretty whitespace-pre-line">
                {examinationData.prescription}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Quay lại
        </Button>
        <Button onClick={onComplete} size="lg">
          Hoàn thành khám bệnh
        </Button>
      </div>
    </div>
  )
}
