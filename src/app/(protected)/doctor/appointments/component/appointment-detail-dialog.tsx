"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  User,
  FileText,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Clock3,
  UserX,
  Loader2,
} from "lucide-react"
import type { AppointmentDetailForDoctor } from "@/types/appointment"
import Loading from "@/components/ui/loading"

interface AppointmentDetailDialogProps {
  appointment: AppointmentDetailForDoctor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
}

const statusConfig = {
  confirmed: {
    label: "Đã xác nhận",
    icon: CheckCircle2,
    color: "bg-green-500",
    variant: "default" as const,
  },
  pending: {
    label: "Chờ xác nhận",
    icon: Clock3,
    color: "bg-yellow-500",
    variant: "secondary" as const,
  },
  "in-progress": {
    label: "Đang khám",
    icon: Loader2,
    color: "bg-purple-500",
    variant: "default" as const,
  },
  completed: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    color: "bg-blue-500",
    variant: "default" as const,
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "bg-red-500",
    variant: "destructive" as const,
  },
  "no-show": {
    label: "Không đến",
    icon: UserX,
    color: "bg-gray-400",
    variant: "secondary" as const,
  },
}

export function AppointmentDetailDialog({ appointment, open, onOpenChange, loading }: AppointmentDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("info")
  const router = useRouter()

  const status = statusConfig[appointment?.status && appointment.status in statusConfig
    ? (appointment.status as keyof typeof statusConfig)
    : "pending"]

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
      router.push(`/examination/${appointment.id}`)
      onOpenChange(false) // Close dialog after navigation
    }
  }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-3 pr-8">
            <div>
              <DialogTitle className="text-2xl font-bold text-balance">Chi tiết cuộc hẹn</DialogTitle>
              <DialogDescription className="mt-2 text-pretty">
                Thông tin chi tiết về cuộc hẹn với bệnh nhân
              </DialogDescription>
            </div>
            {appointment && (
              <Badge variant={status.variant} className="gap-1.5 px-3 py-1.5 w-fit">
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="gap-2">
              <User className="w-4 h-4" />
              Thông tin
            </TabsTrigger>
            <TabsTrigger value="medical" className="gap-2">
              <Stethoscope className="w-4 h-4" />Y tế
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <FileText className="w-4 h-4" />
              Ghi chú
            </TabsTrigger>
          </TabsList>

          {/* Tab: Thông tin cơ bản */}
          <TabsContent value="info" className="space-y-6 mt-6">
            {/* Thông tin bệnh nhân */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Thông tin bệnh nhân
              </h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Họ và tên</p>
                  <p className="font-medium">{appointment.patientName}</p>
                </div>
                {appointment.patient?.dateOfBirth && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tuổi</p>
                    <p className="font-medium">{calculateAge(appointment.patient.dateOfBirth)} tuổi</p>
                  </div>
                )}
                {appointment.patient.gender && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Giới tính</p>
                    <p className="font-medium">
                      {appointment.patient.gender === "male"
                        ? "Nam"
                        : appointment.patient.gender === "female"
                          ? "Nữ"
                          : "Khác"}
                    </p>
                  </div>
                )}
                {appointment.patient?.address && (
                  <div className="space-y-1">
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
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Ngày khám
                  </p>
                  <p className="font-medium">{formatDate(appointment.startAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Giờ khám
                  </p>
                  <p className="font-medium">
                    {formatTime(appointment.startAt)} - {getEndTime(appointment.startAt)}
                  </p>
                </div>

                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">Bác sĩ</p>
                  <p className="font-medium">{appointment.doctorName}</p>
                </div>
                {appointment.notes && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm text-muted-foreground">Ghi chú / Lý do khám</p>
                    <p className="font-medium">{appointment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tab: Thông tin y tế */}
          <TabsContent value="medical" className="space-y-6 mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có thông tin y tế</p>
            </div>
          </TabsContent>

          {/* Tab: Ghi chú */}
          <TabsContent value="notes" className="space-y-6 mt-6">
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
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {appointment.status === "confirmed" && <Button onClick={handleStartExamination}>Bắt đầu khám</Button>}
          {appointment.status === "completed" && <Button>Hoàn thành khám</Button>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
