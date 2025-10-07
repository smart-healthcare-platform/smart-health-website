"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye } from "lucide-react"
import AppointmentDetailDialog from "./appointment-detail-dialog"
import { Appointment } from "@/types"

interface AppointmentCardProps {
  appointment: Appointment
   
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Đã hoàn thành",
          className: "bg-green-500 text-white",
        }
      case "confirmed":
        return {
          label: "Đã xác nhận",
          className: "bg-blue-500 text-white",
        }
      case "pending":
        return {
          label: "Chờ xác nhận",
          className: "bg-yellow-500 text-white",
        }
      case "in-progress":
        return {
          label: "Đang khám",
          className: "bg-purple-500 text-white",
        }
      case "cancelled":
        return {
          label: "Đã hủy",
          className: "bg-red-500 text-white",
        }
      case "no-show":
        return {
          label: "Không đến",
          className: "bg-gray-500 text-white",
        }
      default:
        return {
          label: "Không xác định",
          className: "bg-gray-400 text-white",
        }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
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
    <>
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
                <Badge variant="outline">{appointment.type}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground text-balance">{appointment.doctorName}</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)} className="bg-transparent">
              <Eye className="h-4 w-4 mr-2 text-primary" />
              Chi tiết
            </Button>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(appointment.startAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{formatTime(appointment.startAt)}</span>
            </div>
          </div>
        </div>
      </Card>

      <AppointmentDetailDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} appointment={appointment} />
    </>
  )
}
