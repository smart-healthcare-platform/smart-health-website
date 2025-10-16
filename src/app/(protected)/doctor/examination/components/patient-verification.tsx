"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, Phone, MapPin, Droplet, AlertCircle } from "lucide-react"
import { AppointmentDetailForDoctor } from "@/types"

interface PatientVerificationProps {
  appointment: AppointmentDetailForDoctor
  onNext: () => void
}

export function PatientVerification({ appointment, onNext }: PatientVerificationProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-balance">Xác nhận thông tin bệnh nhân</h2>
        <p className="text-sm text-muted-foreground text-pretty">
          Vui lòng kiểm tra kỹ thông tin bệnh nhân trước khi bắt đầu khám
        </p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Thông tin cơ bản
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Họ và tên</p>
            <p className="font-medium text-lg">{appointment.patientName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Ngày sinh
            </p>
            <p className="font-medium">
              {formatDate(appointment.patient.dateOfBirth)} ({calculateAge(appointment.patient.dateOfBirth)} tuổi)
            </p>
          </div>
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

        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="font-semibold">Thông tin liên hệ</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {/* <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Số điện thoại
            </p>
            <p className="font-medium">{appointment.patient.}</p>
          </div> */}
          <div className="space-y-1 col-span-2">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Địa chỉ
            </p>
            <p className="font-medium text-pretty">{appointment.patient.address}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Medical Alerts */}
      {/* <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          Cảnh báo y tế
        </h3>
        <div className="space-y-3">
          {appointment.allergies && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-medium text-destructive mb-2">Dị ứng</p>
              <p className="text-sm">{appointment.allergies}</p>
            </div>
          )}

          {appointment.chronicDiseases && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-500 mb-2">Bệnh mạn tính</p>
              <p className="text-sm">{appointment.chronicDiseases}</p>
            </div>
          )}

          {!appointment.allergies && !appointment.chronicDiseases && (
            <p className="text-sm text-muted-foreground italic">Không có cảnh báo y tế</p>
          )}
        </div>
      </div> */}

      {appointment.notes && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold">Lý do khám</h3>
            <p className="text-sm text-pretty bg-muted p-4 rounded-lg">{appointment.notes}</p>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex justify-end pt-4">
        <Button onClick={onNext} size="lg">
          Xác nhận và tiếp tục
        </Button>
      </div>
    </div>
  )
}
