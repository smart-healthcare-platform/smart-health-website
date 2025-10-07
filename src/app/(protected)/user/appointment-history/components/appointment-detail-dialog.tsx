"use client"

import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, FileText, Phone, Mail, MapPin, Stethoscope, Activity, X } from "lucide-react"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Appointment } from "@/types"

interface AppointmentDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment
}

export default function AppointmentDetailDialog({ open, onOpenChange, appointment }: AppointmentDetailDialogProps) {
  if (!appointment) return null

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const statusConfig = getStatusConfig(appointment.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 gap-0 border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b px-6 py-6">
          <DialogTitle className="sr-only">Chi tiết lịch hẹn</DialogTitle>
          <DialogDescription className="sr-only">
            Thông tin chi tiết về cuộc hẹn khám bệnh
          </DialogDescription>

          <div className="flex items-start justify-between pr-10">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Chi tiết lịch hẹn</h2>
              <p className="text-sm text-muted-foreground">Thông tin chi tiết về cuộc hẹn khám bệnh</p>
            </div>
            <Badge className={`${statusConfig.className} shadow-sm`}>{statusConfig.label}</Badge>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-6 py-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-6 border shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <Stethoscope className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Thông tin bác sĩ</h3>
                  <p className="text-sm text-muted-foreground">Chuyên gia phụ trách</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bác sĩ</p>
                  <p className="text-base font-semibold">{appointment.doctorName}</p>
                </div>
                {/* <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Chuyên khoa</p>
                  <p className="text-base font-semibold">{appointment.specialty}</p>
                </div> */}
              </div>
            </div>

            <div className="rounded-xl p-6 border bg-card shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Thời gian & Địa điểm</h3>
                  <p className="text-sm text-muted-foreground">Lịch hẹn khám bệnh</p>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ngày khám</p>
                    <p className="text-base font-medium">{formatDate(appointment.startAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Giờ khám</p>
                    <p className="text-base font-medium">
                      {formatTime(appointment.startAt)}
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Địa điểm</p>
                    <p className="text-base font-medium">{mockAppointment.location}</p>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="rounded-xl p-6 border bg-card shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Thông tin bệnh nhân</h3>
                  <p className="text-sm text-muted-foreground">Người đặt lịch hẹn</p>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Họ và tên</p>
                  <p className="text-base font-semibold">{appointment.patientName}</p>
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{mockAppointment.patientPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{mockAppointment.patientEmail}</span>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="rounded-xl p-6 border bg-card shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center shadow-md">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Thông tin y tế</h3>
                  <p className="text-sm text-muted-foreground">Chi tiết về tình trạng sức khỏe</p>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800"
                  >
                    {appointment.type}
                  </Badge>
                </div>
                {appointment.notes && (
                  <div className="space-y-2 p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5" />
                      <span className="text-sm font-medium">Ghi chú / Triệu chứng</span>
                    </div>
                    <p className="text-sm leading-relaxed text-pretty">{appointment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
