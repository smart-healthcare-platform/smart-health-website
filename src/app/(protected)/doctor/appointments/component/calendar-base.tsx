"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

import { Appointment, AppointmentStatus } from "@/types/appointment/index"


interface CalendarBaseProps {
  appointments?: Appointment[]
  loading?: boolean
  onAppointmentClick?: (appointment: Appointment) => void
}

export function CalendarBase({ appointments = [], loading = false, onAppointmentClick }: CalendarBaseProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([])

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // grid ngày
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay.getDay()
  const calendarDays = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const getAppointmentsForDate = (day: number) => {
    return appointments.filter((apt) => {
      const d = new Date(apt.startAt)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return "bg-yellow-500"
      case AppointmentStatus.CONFIRMED:
        return "bg-green-500"
      case AppointmentStatus.CHECKED_IN:
        return "bg-teal-500"
      case AppointmentStatus.IN_PROGRESS:
        return "bg-purple-500"
      case AppointmentStatus.COMPLETED:
        return "bg-blue-500"
      case AppointmentStatus.CANCELLED:
        return "bg-red-500"
      case AppointmentStatus.NO_SHOW:
        return "bg-gray-400"
      default:
        return "bg-gray-200"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
          Đang tải lịch...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex gap-2 items-center">
            <CalendarIcon className="w-5 h-5" /> Lịch hẹn
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="font-medium min-w-[120px] text-center">
              Tháng {month + 1} {year}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="h-48" />

            const dayAppointments = getAppointmentsForDate(day).sort(
              (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
            )
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year

            return (
              <div
                key={`day-${idx}-${day}`}
                className={`p-2 h-48 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors flex flex-col ${isToday ? "bg-primary/10 border-primary" : ""
                  }`}
                onClick={() => {
                  setSelectedDate(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
                  setSelectedAppointments(dayAppointments)
                }}
              >
                <div className={`font-medium mb-1 ${isToday ? "text-primary" : ""}`}>{day}</div>
                <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-thin">
                  {dayAppointments.map((apt) => {
                    const startTime = new Date(apt.startAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    return (
                      <div
                        key={apt.id}
                        className="text-xs px-1.5 py-1 border rounded flex items-center gap-1.5 hover:bg-accent/50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onAppointmentClick?.(apt)
                        }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getStatusColor(apt.status as AppointmentStatus)}`} />
                        <span className="font-medium">{startTime}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Danh sách appointments theo ngày chọn */}
        {selectedDate && (
          <div>
            <h3 className="font-semibold mb-2">
              Lịch hẹn ngày {selectedDate} ({selectedAppointments.length})
            </h3>
            <div className="space-y-2">
              {selectedAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-2 border rounded flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                  onClick={() => onAppointmentClick?.(apt)}
                >
                  <div className="flex gap-2 items-center">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(apt.status as AppointmentStatus)}`} />
                    <span>{apt.patientName}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(apt.startAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
              {selectedAppointments.length === 0 && (
                <div className="text-sm text-muted-foreground">Không có lịch hẹn nào</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
