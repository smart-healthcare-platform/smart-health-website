"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
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
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Clock3,
  UserX,
  Loader2,
} from "lucide-react"

import Loading from "@/components/ui/loading"
import { useSelector } from "react-redux"
import { RootState } from "@/redux"
import { VitalSignStatus } from "@/types/examnation"
import { AppointmentDetail } from "@/types/appointment/appointment.type"
import { AppointmentStatus } from "@/types/appointment/index"
import { Gender } from "@/types/patient/enums/patient-gender.enum.dto"

interface AppointmentDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: AppointmentDetail | null
  loading?: boolean
  userRole?: "doctor" | "patient"
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

interface VitalItemProps {
  label: string
  value?: number | string | null
  unit?: string
}

function VitalItem({ label, value, unit }: VitalItemProps) {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">
        {value ?? "--"} {value ? unit || "" : ""}
      </span>
    </div>
  )
}

const statusConfig: Record<
  AppointmentStatus,
  {
    label: string
    icon: React.ElementType
    color: string
    variant: "default" | "secondary" | "destructive"
  }
> = {
  [AppointmentStatus.PENDING]: {
    label: "Chờ xác nhận",
    icon: Clock3,
    color: "bg-yellow-500",
    variant: "secondary",
  },
  [AppointmentStatus.CONFIRMED]: {
    label: "Đã xác nhận",
    icon: CheckCircle2,
    color: "bg-green-500",
    variant: "default",
  },
  [AppointmentStatus.IN_PROGRESS]: {
    label: "Đang khám",
    icon: Loader2,
    color: "bg-purple-500",
    variant: "default",
  },
  [AppointmentStatus.COMPLETED]: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    color: "bg-blue-500",
    variant: "default",
  },
  [AppointmentStatus.CANCELLED]: {
    label: "Đã hủy",
    icon: XCircle,
    color: "bg-red-500",
    variant: "destructive",
  },
  [AppointmentStatus.NO_SHOW]: {
    label: "Không đến",
    icon: UserX,
    color: "bg-gray-400",
    variant: "secondary",
  },
  [AppointmentStatus.CHECKED_IN]: {
    label: "Đã check-in",
    icon: CheckCircle2,
    color: "bg-green-500",
    variant: "default",
  },
}


export default function AppointmentDetailDialog({
  open,
  onOpenChange,
  appointment,
  loading,
}: AppointmentDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("info")
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth);
  const isDoctor = user?.role === "DOCTOR"
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md text-center py-10">
          <Loading size="md" />
        </DialogContent>
      </Dialog>
    )
  }

  if (!appointment) return null

  const isCompleted = appointment.status === AppointmentStatus.COMPLETED


  const status = statusConfig[appointment.status as AppointmentStatus] ?? statusConfig[AppointmentStatus.PENDING]


  const StatusIcon = status?.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateInput: string | Date) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEndTime = (startAt: string) => {
    const start = new Date(startAt)
    const end = new Date(start.getTime() + 50 * 60 * 1000)
    return formatTime(end)
  }

  const calculateAge = (dateString: string): number => {
    const birthDate = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const handleStartExamination = () => {
    if (appointment?.id) {
      router.push(`/doctor/examination/${appointment.id}`)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="space-y-3 pr-8">
            <div>
              <DialogTitle className="text-2xl font-bold">Chi tiết lịch hẹn</DialogTitle>
              <DialogDescription className="mt-2">Thông tin chi tiết về lịch khám</DialogDescription>
            </div>
            {appointment && (
              <Badge variant={status.variant} className="gap-1.5 px-3 py-1.5 w-fit">
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Separator className="my-4 flex-shrink-0" />

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className={`grid w-full ${isCompleted ? "grid-cols-3" : "grid-cols-1"} flex-shrink-0`}>
              <TabsTrigger value="info" className="gap-2">
                <User className="w-4 h-4" />
                Thông tin
              </TabsTrigger>
              {isCompleted && (
                <>
                  <TabsTrigger value="medical" className="gap-2">
                    <Stethoscope className="w-4 h-4" />Y tế
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Ghi chú
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Tab 1: Thông tin */}
            <TabsContent value="info" className="mt-6 space-y-6 overflow-y-auto flex-1">
              {/* Thông tin bệnh nhân */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Thông tin bệnh nhân
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Họ và tên</p>
                    <p className="font-medium">{appointment.patientName}</p>
                  </div>
                  {isDoctor && appointment.patient?.dateOfBirth && (
                    <div>
                      <p className="text-sm text-muted-foreground">Tuổi</p>
                      <p className="font-medium">{calculateAge(appointment.patient.dateOfBirth)} tuổi</p>
                    </div>
                  )}
                  {isDoctor && appointment.patient?.gender && (
                    <div>
                      <p className="text-sm text-muted-foreground">Giới tính</p>
                      <p className="font-medium">
                        {appointment.patient.gender === Gender.MALE
                          ? "Nam"
                          : appointment.patient.gender === Gender.FEMALE
                            ? "Nữ"
                            : "Khác"}
                      </p>
                    </div>
                  )}
                  {isDoctor && appointment.patient?.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Địa chỉ</p>
                      <p className="font-medium">{appointment.patient.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin lịch hẹn */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Thông tin lịch hẹn
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Ngày khám
                    </p>
                    <p className="font-medium">{formatDate(appointment.startAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Giờ khám
                    </p>
                    <p className="font-medium">
                      {isDoctor
                        ? `${formatTime(appointment.startAt)} - ${getEndTime(appointment.startAt)}`
                        : formatTime(appointment.startAt)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Bác sĩ</p>
                    <p className="font-medium">{appointment.doctorName}</p>
                  </div>
                  {appointment.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Ghi chú / Lý do khám</p>
                      <p className="font-medium">{appointment.notes}</p>
                    </div>
                  )}
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
                    {/* Thông tin khám bệnh */}
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
                        {/* {appointment.medicalRecord.followUpDate && (
                          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase mb-1">
                              Ngày tái khám
                            </p>
                            <p className="text-base font-semibold text-amber-900 dark:text-amber-100">
                              {new Date(appointment.medicalRecord.followUpDate).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        )} */}
                      </div>
                    </div>

                    {/* Chỉ số sinh hiệu */}
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
                                  appointment.medicalRecord.vitalSigns.status === VitalSignStatus.WAITING_FOR_TEST_RESULT
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                {appointment.medicalRecord.vitalSigns.status === VitalSignStatus.WAITING_FOR_TEST_RESULT
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
                {appointment.notes ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Ghi chú
                    </h3>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="whitespace-pre-wrap text-pretty">{appointment.notes}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Chưa có ghi chú</p>
                  </div>
                )}

                {/* Thông tin tạo/cập nhật */}
                {isDoctor && (
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p className="mb-1">Ngày tạo</p>
                        <p className="font-medium text-foreground">{formatDate(appointment.createdAt)}</p>
                      </div>
                      <div>
                        <p className="mb-1">Cập nhật lần cuối</p>
                        <p className="font-medium text-foreground">{formatDate(appointment.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>

        <Separator className="my-4 flex-shrink-0" />

        <div className="flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {isDoctor && appointment.status === AppointmentStatus.CONFIRMED && (
            <Button onClick={handleStartExamination}>Bắt đầu khám</Button>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}
