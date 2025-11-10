"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, User, Activity, FileText, Pill, Calendar } from "lucide-react"
import type { SummaryStepProps } from "@/types/examination"
import { formatCurrencyVND } from "@/lib/format"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function SummaryStep({ appointment, examinationData, onComplete, onPrevious }: SummaryStepProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }
  console.log("DỮ liệu: ",examinationData)
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
            <span className="font-medium">{formatDate(appointment.patient.dateOfBirth)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Giới tính:</span>
            <span className="font-medium">{appointment.patient.gender === "male"
              ? "Nam"
              : appointment.patient.gender === "female"
                ? "Nữ"
                : "Khác"}</span>
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
              Chỉ số sinh hiệu cơ bản
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg grid grid-cols-2 gap-3">
              {/* Huyết áp */}
              {examinationData.vitalSigns.systolicPressure && (
                <div>
                  <span className="text-sm text-muted-foreground">Huyết áp:</span>
                  <p className="font-medium">
                    {examinationData.vitalSigns.systolicPressure}/
                    {examinationData.vitalSigns.diastolicPressure} mmHg
                  </p>
                </div>
              )}

              {/* Nhiệt độ */}
              {examinationData.vitalSigns.temperature && (
                <div>
                  <span className="text-sm text-muted-foreground">Nhiệt độ:</span>
                  <p className="font-medium">{examinationData.vitalSigns.temperature} °C</p>
                </div>
              )}

              {/* SpO₂ */}
              {examinationData.vitalSigns.oxygenSaturation && (
                <div>
                  <span className="text-sm text-muted-foreground">SpO₂:</span>
                  <p className="font-medium">{examinationData.vitalSigns.oxygenSaturation} %</p>
                </div>
              )}

              {/* Cân nặng */}
              {examinationData.vitalSigns.weight && (
                <div>
                  <span className="text-sm text-muted-foreground">Cân nặng:</span>
                  <p className="font-medium">{examinationData.vitalSigns.weight} kg</p>
                </div>
              )}

              {/* Chiều cao */}
              {examinationData.vitalSigns.height && (
                <div>
                  <span className="text-sm text-muted-foreground">Chiều cao:</span>
                  <p className="font-medium">{examinationData.vitalSigns.height} cm</p>
                </div>
              )}

              {/* BMI */}
              {examinationData.vitalSigns.bmi && (
                <div>
                  <span className="text-sm text-muted-foreground">Chỉ số BMI:</span>
                  <p className="font-medium">{examinationData.vitalSigns.bmi}</p>
                </div>
              )}

              {/* Nhịp tim (nếu có) */}
              {examinationData.vitalSigns.heartRate && (
                <div>
                  <span className="text-sm text-muted-foreground">Nhịp tim:</span>
                  <p className="font-medium">{examinationData.vitalSigns.heartRate} lần/phút</p>
                </div>
              )}
            </div>

            {/* Ghi chú */}
            {examinationData.vitalSigns.notes && (
              <div className="mt-2">
                <span className="text-sm text-muted-foreground block mb-1">Ghi chú:</span>
                <p className="text-sm bg-muted/50 p-3 rounded text-pretty whitespace-pre-line">
                  {examinationData.vitalSigns.notes}
                </p>
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Follow-up Suggestion */}
      {examinationData.followUpSuggestion?.suggestedDate && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Đề xuất tái khám
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Ngày đề xuất:</span>
              <span className="font-medium text-blue-900">
                {formatDate(examinationData.followUpSuggestion.suggestedDate)}
              </span>
            </div>
            {examinationData.followUpSuggestion.reason && (
              <div>
                <span className="text-sm text-muted-foreground block mb-1">Lý do:</span>
                <p className="text-sm text-blue-900 bg-blue-100 p-2 rounded text-pretty">
                  {examinationData.followUpSuggestion.reason}
                </p>
              </div>
            )}
          </div>
        </div>
      )}


      {examinationData.followUpDate && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Ngày tái khám:</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900">{formatDate(examinationData.followUpDate.toString())}</p>
          </div>
        </div>
      )}
      {/* Examination Details */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Kết quả khám
        </h3>

        <div className="space-y-4">
          {/* Lý do khám */}
          {examinationData.chiefComplaint && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Lý do khám:</p>
              <p className="text-sm bg-muted/50 p-3 rounded text-pretty">
                {examinationData.chiefComplaint}
              </p>
            </div>
          )}

          {/* Triệu chứng */}
          {examinationData.symptoms && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Triệu chứng:</p>
              <p className="text-sm bg-muted/50 p-3 rounded text-pretty">
                {examinationData.symptoms}
              </p>
            </div>
          )}

          {/* Khám lâm sàng */}
          {examinationData.examination && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Khám lâm sàng:</p>
              <p className="text-sm bg-muted/50 p-3 rounded text-pretty">
                {examinationData.examination}
              </p>
            </div>
          )}

          {/* Chẩn đoán */}
          {examinationData.diagnosis && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Chẩn đoán:</p>
              <p className="text-sm bg-muted/50 p-3 rounded text-pretty">
                {examinationData.diagnosis}
              </p>
            </div>
          )}



          {examinationData.labTests?.length ? (
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Xét nghiệm được chỉ định:
              </p>
              <div className="bg-muted/50 p-3 rounded text-sm space-y-1">
                {examinationData.labTests.map((t: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{t.name}</span>
                    {t.price !== undefined && (
                      <span className="text-muted-foreground">
                        {formatCurrencyVND(t.price)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : "Không có"}



          {/* Đơn thuốc - NEW: Hiển thị structured prescription items */}
          {examinationData.prescriptionItems && examinationData.prescriptionItems.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Pill className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground font-medium">Đơn thuốc:</p>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[40px]">STT</TableHead>
                      <TableHead>Tên thuốc</TableHead>
                      <TableHead>Liều lượng</TableHead>
                      <TableHead className="w-[100px]">Số lượng</TableHead>
                      <TableHead className="w-[100px]">Thời gian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examinationData.prescriptionItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{item.drugName}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.activeIngredient} - {item.strength}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{item.dosage}</p>
                            <p className="text-xs text-muted-foreground">{item.instructions}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{item.quantity}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{item.duration} ngày</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Hiển thị notes nếu có */}
              {examinationData.prescriptionItems.some(item => item.notes) && (
                <div className="mt-3 space-y-2">
                  {examinationData.prescriptionItems.map((item, index) =>
                    item.notes ? (
                      <div key={index} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-amber-900 mb-1">
                          Lưu ý - {item.drugName}:
                        </p>
                        <p className="text-xs text-amber-800">{item.notes}</p>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
          ) : (
            examinationData.prescription && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Đơn thuốc:</p>
                <p className="text-sm bg-muted/50 p-3 rounded text-pretty whitespace-pre-line">
                  {examinationData.prescription}
                </p>
              </div>
            )
          )}
        </div>
      </div>


      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Quay lại
        </Button>
        <Button onClick={() => onComplete()} size="lg">
          Hoàn thành khám bệnh
        </Button>
      </div>


    </div>
  )
}
