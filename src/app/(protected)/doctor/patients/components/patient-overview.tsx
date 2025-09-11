"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Phone, Mail, MapPin, Calendar, Heart, AlertTriangle, FileText, Clock, Edit } from "lucide-react"
import type { Patient } from "@/types/patient"

interface PatientOverviewProps {
  patient: Patient
  onEdit?: () => void
}

export function PatientOverview({ patient, onEdit }: PatientOverviewProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const getGenderLabel = (gender: string) => {
    const labels = {
      male: "Nam",
      female: "Nữ",
      other: "Khác",
    }
    return labels[gender as keyof typeof labels] || gender
  }

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                  {getInitials(patient.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold text-balance">{patient.fullName}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {getGenderLabel(patient.gender)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {calculateAge(patient.dateOfBirth)} tuổi
                  </span>
                  <Badge variant="outline">ID: {patient.patientId}</Badge>
                </div>
              </div>
            </div>
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Thông tin liên hệ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{patient.phone}</span>
            </div>
            {patient.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{patient.email}</span>
              </div>
            )}
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
              <div className="text-sm">
                <div>{patient.address.street}</div>
                <div className="text-muted-foreground">
                  {patient.address.ward}, {patient.address.district}
                </div>
                <div className="text-muted-foreground">{patient.address.city}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Thông tin y tế
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {patient.bloodType && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nhóm máu:</span>
                <Badge variant="secondary">{patient.bloodType}</Badge>
              </div>
            )}

            <div>
              <div className="text-sm text-muted-foreground mb-2">Dị ứng:</div>
              {patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {allergy}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Không có</span>
              )}
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Bệnh mạn tính:</div>
              {patient.chronicConditions.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {patient.chronicConditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Không có</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Liên hệ khẩn cấp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Họ tên:</span>
              <span className="font-medium">{patient.emergencyContact.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Mối quan hệ:</span>
              <span>{patient.emergencyContact.relationship}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Số điện thoại:</span>
              <span className="font-medium">{patient.emergencyContact.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Thông tin bảo hiểm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.insuranceNumber ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Số thẻ BHYT:</span>
                  <span className="font-medium">{patient.insuranceNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nơi cấp:</span>
                  <span>{patient.insuranceProvider}</span>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có thông tin bảo hiểm</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Thông tin hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ngày tạo:</span>
              <span>{new Date(patient.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cập nhật lần cuối:</span>
              <span>{new Date(patient.updatedAt).toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Trạng thái:</span>
              <Badge variant={patient.isActive ? "default" : "secondary"}>
                {patient.isActive ? "Đang hoạt động" : "Không hoạt động"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
