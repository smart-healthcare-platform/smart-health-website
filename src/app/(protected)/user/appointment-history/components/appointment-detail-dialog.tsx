"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  User,
  Stethoscope,
  FileText,
  Activity,
  Thermometer,
  Heart,
  Droplet,
  Ruler,
  Weight,
  Calculator,
  Beaker,
} from "lucide-react"
import type { AppointmentDetailForDoctor } from "@/types"

interface AppointmentDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: AppointmentDetailForDoctor
}

interface VitalCardProps {
  icon: React.ReactNode
  label: string
  value?: number | string | null
  unit?: string
  colorClass?: string
}

function VitalCard({ icon, label, value, unit, colorClass = "bg-blue-50 border-blue-200" }: VitalCardProps) {
  return (
    <div className={`${colorClass} border-2 rounded-xl p-4 transition-all hover:shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="text-primary">{icon}</div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-2xl font-bold text-foreground">
        {value ?? "—"}
        {value && unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
      </div>
    </div>
  )
}

export default function AppointmentDetailDialog({ open, onOpenChange, appointment }: AppointmentDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("info")
  if (!appointment) return null

  const isCompleted = appointment.status === "completed"

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { label: "Đã hoàn thành", className: "bg-green-500 text-white" }
      case "confirmed":
        return { label: "Đã xác nhận", className: "bg-blue-500 text-white" }
      case "pending":
        return { label: "Chờ xác nhận", className: "bg-yellow-500 text-white" }
      case "in-progress":
        return { label: "Đang khám", className: "bg-purple-500 text-white" }
      case "cancelled":
        return { label: "Đã hủy", className: "bg-red-500 text-white" }
      default:
        return { label: "Không xác định", className: "bg-gray-400 text-white" }
    }
  }

  const statusConfig = getStatusConfig(appointment.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="space-y-3 pr-8">
            <DialogTitle className="text-2xl font-bold">Chi tiết lịch hẹn</DialogTitle>
            <DialogDescription>Thông tin chi tiết về lịch khám</DialogDescription>
            <Badge className={`${statusConfig.className}`}>{statusConfig.label}</Badge>
          </div>
        </DialogHeader>

        <Separator className="my-4 flex-shrink-0" />

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className={`grid w-full ${isCompleted ? "grid-cols-3" : "grid-cols-1"} flex-shrink-0`}>
              <TabsTrigger value="info">
                <User className="w-4 h-4 mr-2" /> Thông tin
              </TabsTrigger>
              {isCompleted && (
                <>
                  <TabsTrigger value="medical">
                    <Stethoscope className="w-4 h-4 mr-2" /> Y tế
                  </TabsTrigger>
                  <TabsTrigger value="notes">
                    <FileText className="w-4 h-4 mr-2" /> Ghi chú
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Tab 1: Thông tin */}
            <TabsContent value="info" className="mt-6 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Thông tin bệnh nhân
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Họ và tên</p>
                    <p className="font-medium">{appointment.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày khám</p>
                    <p className="font-medium">{formatDate(appointment.startAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Giờ khám</p>
                    <p className="font-medium">{formatTime(appointment.startAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bác sĩ</p>
                    <p className="font-medium">{appointment.doctorName}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Y tế */}
            {isCompleted && (
              <TabsContent value="medical" className="mt-6 space-y-6 overflow-y-auto flex-1">
                {!appointment.medicalRecord ? (
                  <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl">
                    <Stethoscope className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">Chưa có thông tin y tế</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                      <h3 className="font-bold text-xl flex items-center gap-2 mb-4 text-blue-900 dark:text-blue-100">
                        <Stethoscope className="w-6 h-6" />
                        Thông tin khám bệnh
                      </h3>

                      <div className="grid gap-4">
                        <div className="bg-white/80 dark:bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Triệu chứng</p>
                          <p className="text-base">{appointment.medicalRecord.symptoms || "—"}</p>
                        </div>
                        <div className="bg-white/80 dark:bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Chẩn đoán</p>
                          <p className="text-base font-medium text-blue-700 dark:text-blue-300">
                            {appointment.medicalRecord.diagnosis || "—"}
                          </p>
                        </div>
                        <div className="bg-white/80 dark:bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Ghi chú bác sĩ</p>
                          <p className="text-base">{appointment.medicalRecord.doctorNotes || "—"}</p>
                        </div>
                        <div className="bg-white/80 dark:bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Đơn thuốc</p>
                          <p className="text-base">{appointment.medicalRecord.prescription || "—"}</p>
                        </div>
                        {appointment.medicalRecord.followUpDate && (
                          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase mb-1">
                              Ngày tái khám
                            </p>
                            <p className="text-base font-semibold text-amber-900 dark:text-amber-100">
                              {new Date(appointment.medicalRecord.followUpDate).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="font-bold text-xl flex items-center gap-2 text-foreground">
                        <Activity className="w-6 h-6 text-primary" />
                        Chỉ số sinh hiệu
                      </h3>

                      {appointment.medicalRecord.vitalSigns ? (
                        <>
                          {/* Basic Vitals */}
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                              Chỉ số cơ bản
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              <VitalCard
                                icon={<Thermometer className="w-5 h-5" />}
                                label="Nhiệt độ"
                                value={appointment.medicalRecord.vitalSigns.temperature}
                                unit="°C"
                                colorClass="bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                              />
                              <VitalCard
                                icon={<Heart className="w-5 h-5" />}
                                label="Huyết áp"
                                value={
                                  appointment.medicalRecord.vitalSigns.systolicPressure &&
                                  appointment.medicalRecord.vitalSigns.diastolicPressure
                                    ? `${appointment.medicalRecord.vitalSigns.systolicPressure}/${appointment.medicalRecord.vitalSigns.diastolicPressure}`
                                    : null
                                }
                                unit=""
                                colorClass="bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800"
                              />
                              <VitalCard
                                icon={<Activity className="w-5 h-5" />}
                                label="SpO₂"
                                value={appointment.medicalRecord.vitalSigns.oxygenSaturation}
                                unit="%"
                                colorClass="bg-cyan-50 border-cyan-200 dark:bg-cyan-950/20 dark:border-cyan-800"
                              />
                            </div>
                          </div>

                          {/* Body Measurements */}
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                              Chỉ số cơ thể
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              <VitalCard
                                icon={<Ruler className="w-5 h-5" />}
                                label="Chiều cao"
                                value={appointment.medicalRecord.vitalSigns.height}
                                unit="cm"
                                colorClass="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                              />
                              <VitalCard
                                icon={<Weight className="w-5 h-5" />}
                                label="Cân nặng"
                                value={appointment.medicalRecord.vitalSigns.weight}
                                unit="kg"
                                colorClass="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800"
                              />
                              <VitalCard
                                icon={<Calculator className="w-5 h-5" />}
                                label="BMI"
                                value={appointment.medicalRecord.vitalSigns.bmi}
                                unit=""
                                colorClass="bg-teal-50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-800"
                              />
                            </div>
                          </div>

                          {/* Lab Results */}
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                              Kết quả xét nghiệm
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              <VitalCard
                                icon={<Droplet className="w-5 h-5" />}
                                label="Đường huyết"
                                value={appointment.medicalRecord.vitalSigns.bloodSugar}
                                unit="mg/dL"
                                colorClass="bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800"
                              />
                              <VitalCard
                                icon={<Beaker className="w-5 h-5" />}
                                label="Cholesterol"
                                value={appointment.medicalRecord.vitalSigns.cholesterolTotal}
                                unit="mg/dL"
                                colorClass="bg-violet-50 border-violet-200 dark:bg-violet-950/20 dark:border-violet-800"
                              />
                              <VitalCard
                                icon={<Beaker className="w-5 h-5" />}
                                label="HDL"
                                value={appointment.medicalRecord.vitalSigns.hdl}
                                unit="mg/dL"
                                colorClass="bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-800"
                              />
                              <VitalCard
                                icon={<Beaker className="w-5 h-5" />}
                                label="LDL"
                                value={appointment.medicalRecord.vitalSigns.ldl}
                                unit="mg/dL"
                                colorClass="bg-fuchsia-50 border-fuchsia-200 dark:bg-fuchsia-950/20 dark:border-fuchsia-800"
                              />
                              <VitalCard
                                icon={<Beaker className="w-5 h-5" />}
                                label="Triglycerides"
                                value={appointment.medicalRecord.vitalSigns.triglycerides}
                                unit="mg/dL"
                                colorClass="bg-pink-50 border-pink-200 dark:bg-pink-950/20 dark:border-pink-800"
                              />
                              <VitalCard
                                icon={<Beaker className="w-5 h-5" />}
                                label="Creatinine"
                                value={appointment.medicalRecord.vitalSigns.creatinine}
                                unit="mg/dL"
                                colorClass="bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
                              />
                            </div>
                          </div>

                          {/* Status and Notes */}
                          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  appointment.medicalRecord.vitalSigns.status === "waiting_for_test_result"
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                {appointment.medicalRecord.vitalSigns.status === "waiting_for_test_result"
                                  ? "Đang chờ kết quả"
                                  : "Hoàn tất"}
                              </Badge>
                            </div>
                            {appointment.medicalRecord.vitalSigns.notes && (
                              <div className="pt-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Ghi chú</p>
                                <p className="text-sm">{appointment.medicalRecord.vitalSigns.notes}</p>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-muted-foreground py-12 bg-muted/30 rounded-xl">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p className="text-lg font-medium">Chưa có chỉ số sinh hiệu</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>
            )}

            {/* Tab 3: Ghi chú */}
            {isCompleted && (
              <TabsContent value="notes" className="mt-6 space-y-6 overflow-y-auto flex-1">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Ghi chú
                  </h3>
                  <p className="text-sm mt-2 text-muted-foreground">{appointment.notes || "Không có ghi chú"}</p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <Separator className="my-4 flex-shrink-0" />

        <div className="flex justify-end flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
