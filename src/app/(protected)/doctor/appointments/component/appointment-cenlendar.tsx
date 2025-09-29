"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { useAppointments } from "@/hooks/useAppointments"
import Loading from "@/components/ui/loading"
import { DayAppointmentsModal } from "@/components/ui/day-appointment-modal"
import type { Appointment } from "@/types/appointment"

export function AppointmentCalendar() {
  // 🔹 Lấy doctorId từ Redux (giả sử doctor slice có currentDoctor)
  const doctorId = 'a84d38d8-eb22-48a7-aa5f-1927b83fcfd8'

  const { appointments, loading } = useAppointments(doctorId)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([])

  if (loading) return <Loading />

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()

  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay.getDay()
  const calendarDays = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const getAppointmentsForDate = (day: number): Appointment[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments?.filter((apt) => apt.startAt?.startsWith(dateStr)) ?? []
  }

  const getStatusColor = (status: Appointment["status"]) => ({
    confirmed: "bg-green-500",
    pending: "bg-yellow-500",
    "in-progress": "bg-purple-500",
    completed: "bg-blue-500",
    cancelled: "bg-red-500",
    "no-show": "bg-gray-400",
  }[status])

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
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={idx} className="h-24" />

            const dayAppointments = getAppointmentsForDate(day)

            return (
              <div
                key={day}
                className={`p-2 h-24 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                  today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
                    ? "bg-primary/10 border-primary"
                    : ""
                }`}
                onClick={() => {
                  setSelectedDate(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
                  setSelectedAppointments(dayAppointments)
                }}
              >
                <div className="font-medium">{day}</div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((apt) => (
                    <div
                      key={apt.id}
                      className="text-xs p-1 border rounded truncate flex items-center gap-1"
                    >
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(apt.status)}`} />
                      <span>{apt.patientName}</span>
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-primary">+{dayAppointments.length - 2} lịch hẹn</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      {/* TODO: Modal chi tiết lịch hẹn */}
      {/* {selectedDate && (
        <DayAppointmentsModal
          open
          date={selectedDate}
          appointments={selectedAppointments}
          onClose={() => setSelectedDate(null)}
        />
      )} */}
    </Card>
  )
}
