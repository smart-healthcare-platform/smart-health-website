"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, Phone, MapPin } from "lucide-react"
import { AppointmentDetail } from "@/types/appointment/appointment.type"
import { Gender } from "@/types/patient/enums/patient-gender.enum.dto"
import { patientService } from "@/services/patient.service"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import SuccessDialog from "@/components/ui/success-dialog"

interface PatientVerificationProps {
  appointment: AppointmentDetail
  onNext: () => void
}

export function PatientVerification({ appointment, onNext }: PatientVerificationProps) {
  const [open, setOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const [editName, setEditName] = useState(appointment.patientName)
  const [editDOB, setEditDOB] = useState(appointment.patient.dateOfBirth)
  const [editGender, setEditGender] = useState<Gender>(
    appointment.patient.gender || Gender.MALE
  )
  const [editPhone, setEditPhone] = useState(appointment.patient.phone)
  const [editAddress, setEditAddress] = useState(appointment.patient.address)

  const calculateAge = (dateString: string) => {
    const birthDate = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

  const handleSave = async () => {
    try {
      const updated = await patientService.updatePatient(appointment.patient.id, {
        full_name: editName,
        date_of_birth: editDOB,
        gender: editGender,
        phone: editPhone,
        address: editAddress,
      })

      if (updated) {
        appointment.patientName = updated.full_name
        appointment.patient.dateOfBirth = updated.date_of_birth

        // Xử lý Gender an toàn
        if (updated.gender === Gender.MALE || updated.gender === Gender.FEMALE) {
          appointment.patient.gender = updated.gender
        } else {
          appointment.patient.gender = Gender.MALE
        }

        appointment.patient.phone = updated.phone || ""
        appointment.patient.address = updated.address || ""

        // Cập nhật state hiển thị
        setEditName(updated.full_name)
        setEditDOB(updated.date_of_birth)
        setEditGender(appointment.patient.gender)
        setEditPhone(updated.phone || "")
        setEditAddress(updated.address || "")

        setOpen(false)
        setSuccessOpen(true)
      }
    } catch (error) {
      console.error("Failed to update patient", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-balance">Xác nhận thông tin bệnh nhân</h2>
          <p className="text-sm text-muted-foreground text-pretty">
            Vui lòng kiểm tra kỹ thông tin bệnh nhân trước khi bắt đầu khám
          </p>
        </div>
        <Button onClick={() => setOpen(true)} variant="outline" size="sm">
          Điều chỉnh thông tin
        </Button>
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
              {appointment.patient.gender === Gender.MALE
                ? "Nam"
                : appointment.patient.gender === Gender.FEMALE
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <p className="font-medium">{appointment.patient.phone}</p>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <p className="font-medium text-pretty">{appointment.patient.address}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Notes */}
      {appointment.notes && (
        <div className="space-y-2">
          <h3 className="font-semibold">Lý do khám</h3>
          <p className="text-sm text-pretty bg-muted p-4 rounded-lg">{appointment.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end pt-4">
        <Button onClick={onNext} size="lg">
          Xác nhận và tiếp tục
        </Button>
      </div>

      {/* Dialog chỉnh sửa */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin bệnh nhân</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <p className="text-sm">Họ và tên</p>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>

            <div className="space-y-1">
              <p className="text-sm">Ngày sinh</p>
              <Input type="date" value={editDOB} onChange={(e) => setEditDOB(e.target.value)} />
            </div>

            <div className="space-y-1">
              <p className="text-sm">Giới tính</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    checked={editGender === Gender.MALE}
                    onChange={() => setEditGender(Gender.MALE)}
                  />
                  Nam
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    checked={editGender === Gender.FEMALE}
                    onChange={() => setEditGender(Gender.FEMALE)}
                  />
                  Nữ
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm">Số điện thoại</p>
              <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
            </div>

            <div className="space-y-1">
              <p className="text-sm">Địa chỉ</p>
              <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog success */}
      <SuccessDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Cập nhật thành công"
        message="Thông tin bệnh nhân đã được cập nhật thành công."
        confirmText="Đóng"
      />
    </div>
  )
}
