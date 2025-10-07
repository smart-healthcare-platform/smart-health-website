import { Calendar, User, Stethoscope, Clock, FileText, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface Record {
  id: string
  patientName: string
  patientAge: number
  patientGender: string
  diagnosis: string
  examDate: string
  status: "completed" | "pending" | "follow-up"
  specialty: string
  symptoms: string
  treatment: string
  nextAppointment?: string
}

interface RecordCardProps {
  record: Record
}

const statusConfig = {
  completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
  pending: { label: "Đang xử lý", color: "bg-yellow-100 text-yellow-800" },
  "follow-up": { label: "Tái khám", color: "bg-blue-100 text-blue-800" },
}

export function RecordCard({ record }: RecordCardProps) {
  const statusInfo = statusConfig[record.status]

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">#{record.id}</h3>
                <p className="text-sm text-gray-600">{record.specialty}</p>
              </div>
            </div>
            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{record.patientName}</span>
                <span className="text-gray-500">
                  ({record.patientAge} tuổi, {record.patientGender})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{record.diagnosis}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">Khám: {new Date(record.examDate).toLocaleDateString("vi-VN")}</span>
              </div>
              {record.nextAppointment && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">
                    Tái khám: {new Date(record.nextAppointment).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Symptoms & Treatment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Triệu chứng:</p>
              <p className="text-sm text-gray-700">{record.symptoms}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Điều trị:</p>
              <p className="text-sm text-gray-700">{record.treatment}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2 lg:ml-6">
          <Button variant="outline" size="sm" className="bg-white">
            <Eye className="h-4 w-4 mr-2" />
            Xem chi tiết
          </Button>
          <Button variant="outline" size="sm" className="bg-white">
            <FileText className="h-4 w-4 mr-2" />
            In bệnh án
          </Button>
        </div>
      </div>
    </Card>
  )
}
