"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, Calendar, User, Stethoscope, Pill, TrendingUp, Plus, Eye } from "lucide-react"
import type { MedicalRecord } from "@/types/patient"

interface MedicalHistoryProps {
  records: MedicalRecord[]
  loading?: boolean
  onViewRecord?: (record: MedicalRecord) => void
  onCreateRecord?: () => void
}

export function MedicalHistory({ records, loading = false, onViewRecord, onCreateRecord }: MedicalHistoryProps) {
  const getVisitTypeLabel = (type: MedicalRecord["visitType"]) => {
    const labels = {
      consultation: "Khám bệnh",
      "follow-up": "Tái khám",
      emergency: "Cấp cứu",
      surgery: "Phẫu thuật",
      checkup: "Khám định kỳ",
    }
    return labels[type] || type
  }

  const getVisitTypeBadge = (type: MedicalRecord["visitType"]) => {
    const variants = {
      consultation: "default",
      "follow-up": "secondary",
      emergency: "destructive",
      surgery: "outline",
      checkup: "secondary",
    } as const

    return <Badge variant={variants[type] || "default"}>{getVisitTypeLabel(type)}</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Đang tải hồ sơ bệnh án...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Lịch sử khám bệnh
          </CardTitle>
          <Button onClick={onCreateRecord} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Thêm hồ sơ
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Chưa có hồ sơ bệnh án</h3>
            <p className="text-muted-foreground mb-4">Bệnh nhân chưa có lịch sử khám bệnh nào được ghi nhận</p>
            <Button onClick={onCreateRecord} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Tạo hồ sơ đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {records.map((record, index) => (
              <div key={record.id}>
                <div className="flex items-start gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    {index < records.length - 1 && <div className="w-px h-16 bg-border mt-2" />}
                  </div>

                  {/* Record content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{new Date(record.visitDate).toLocaleDateString("vi-VN")}</span>
                          {getVisitTypeBadge(record.visitType)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{record.doctorName}</span>
                          <span>•</span>
                          <span>{record.department}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onViewRecord?.(record)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      {/* Chief Complaint */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Stethoscope className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Lý do khám:</span>
                        </div>
                        <p className="text-sm pl-6">{record.chiefComplaint}</p>
                      </div>

                      {/* Diagnosis */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Chẩn đoán:</span>
                        </div>
                        <div className="pl-6">
                          <p className="text-sm font-medium">{record.diagnosis.primary}</p>
                          {record.diagnosis.secondary && record.diagnosis.secondary.length > 0 && (
                            <div className="mt-1">
                              {record.diagnosis.secondary.map((diag, idx) => (
                                <p key={idx} className="text-sm text-muted-foreground">
                                  • {diag}
                                </p>
                              ))}
                            </div>
                          )}
                          {record.diagnosis.icd10Code && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              ICD-10: {record.diagnosis.icd10Code}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Medications */}
                      {record.medications.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Pill className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Đơn thuốc:</span>
                          </div>
                          <div className="pl-6 space-y-1">
                            {record.medications.map((med, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-medium">{med.name}</span>
                                <span className="text-muted-foreground ml-2">
                                  {med.dosage} - {med.frequency} - {med.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up */}
                      {record.followUpDate && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Tái khám:</span>
                          </div>
                          <p className="text-sm pl-6">
                            {new Date(record.followUpDate).toLocaleDateString("vi-VN")}
                            {record.followUpInstructions && (
                              <span className="block text-muted-foreground mt-1">{record.followUpInstructions}</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < records.length - 1 && <Separator className="my-6" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
