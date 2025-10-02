"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import type { Appointment } from "@/types/appointment"

interface CalendarBaseProps {
  appointments?: Appointment[]
  loading?: boolean
  onAppointmentClick?: (appointment: Appointment) => void
}

export function CalendarBase({
  appointments = [],
  loading = false,
  onAppointmentClick,
}: CalendarBaseProps) {
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
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      )
    })
  }

  const getStatusColor = (status: Appointment["status"]) => ({
    confirmed: "bg-green-500",
    pending: "bg-yellow-500",
    "in-progress": "bg-purple-500",
    completed: "bg-blue-500",
    cancelled: "bg-red-500",
    "no-show": "bg-gray-400",
  }[status] ?? "bg-gray-200")

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="font-medium min-w-[120px] text-center">
              Tháng {month + 1} {year}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Lưới calendar */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="h-24" />

            const dayAppointments = getAppointmentsForDate(day)
            const isToday =
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year

            return (
              <div
                key={`day-${idx}-${day}`}
                className={`p-2 h-24 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                  isToday ? "bg-primary/10 border-primary" : ""
                }`}
                onClick={() => {
                  setSelectedDate(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
                  setSelectedAppointments(dayAppointments)
                }}
              >
                <div className={`font-medium ${isToday ? "text-primary" : ""}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((apt) => (
                    <div
                      key={apt.id}
                      className="text-xs p-1 border rounded truncate flex items-center gap-1 hover:bg-accent/50"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          apt.status
                        )}`}
                      />
                      <span>{apt.patientName}</span>
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-primary">
                      +{dayAppointments.length - 2} lịch hẹn
                    </div>
                  )}
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
                    <span
                      className={`w-2 h-2 rounded-full ${getStatusColor(
                        apt.status
                      )}`}
                    />
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
                <div className="text-sm text-muted-foreground">
                  Không có lịch hẹn nào
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
