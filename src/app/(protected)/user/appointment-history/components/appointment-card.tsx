"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Building2, StickyNote, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import type { Appointment } from "@/types/appointment"

interface AppointmentCardProps {
  appointment: Appointment
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Đã hoàn thành",
          variant: "default" as const,
          className: "bg-success text-success-foreground",
        }
      case "confirmed":
        return {
          label: "Đã xác nhận",
          variant: "secondary" as const,
          className: "bg-info text-info-foreground",
        }
      case "pending":
        return {
          label: "Chờ xác nhận",
          variant: "outline" as const,
          className: "bg-warning text-warning-foreground",
        }
      case "in-progress":
        return {
          label: "Đang khám",
          variant: "secondary" as const,
          className: "bg-blue-500 text-white",
        }
      case "cancelled":
        return {
          label: "Đã hủy",
          variant: "destructive" as const,
          className: "bg-destructive text-destructive-foreground",
        }
      case "no-show":
        return {
          label: "Không đến",
          variant: "outline" as const,
          className: "bg-gray-500 text-white",
        }
      default:
        return {
          label: "Không xác định",
          variant: "outline" as const,
          className: "",
        }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
              <Badge variant="outline" className="font-medium">
                {appointment.type}
              </Badge>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-2 text-balance">{appointment.doctorName}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formatDate(appointment.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>{formatTime(appointment.startAt)}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4 text-primary" />
                <span>{appointment.doctorName}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                <span>ID: {appointment.slotId.slice(0, 8)}...</span>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="self-start lg:self-center"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Chi tiết
                </>
              )}
            </Button>
          )}
        </div>

        {isExpanded && appointment.notes && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex gap-3">
              <StickyNote className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Ghi chú</h4>
                <p className="text-sm text-muted-foreground text-pretty">{appointment.notes}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
