"use client"

import { useState } from "react"
import { useAppointments } from "@/hooks/use-appointments"
import { CalendarBase } from "./calendar-base"
import type { Appointment } from "@/types/appointment"

export function AppointmentCalendar({ doctorId }: { doctorId: string }) {
  const { appointments, loading } = useAppointments(doctorId)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([])
  console.log("Dữ liệu nhận dc", appointments)
  return (
    <>
      <CalendarBase
        appointments={appointments}
        loading={loading}
        // onDateSelect={(date, aps) => console.log("📅 Chọn ngày:", date, aps)}
        onAppointmentClick={(apt) => console.log("👉 Click appointment:", apt)}
      />

      {/* TODO: Modal chi tiết lịch hẹn */}
      {/* {selectedDate && (
        <DayAppointmentsModal
          open
          date={selectedDate}
          appointments={selectedAppointments}
          onClose={() => setSelectedDate(null)}
        />
      )} */}
    </>
  )
}
