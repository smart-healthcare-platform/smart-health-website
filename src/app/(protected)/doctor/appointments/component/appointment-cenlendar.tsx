"use client"

import { useState } from "react"
import { useAppointments } from "@/hooks/use-appointments"
import { CalendarBase } from "./calendar-base"
import AppointmentDetailDialog from "@/components/common/appointment-detail-dialog"
import type { Appointment, AppointmentDetail } from "@/types/appointment"
import { appointmentService } from "@/services/appointment.service"

export function AppointmentCalendar({ doctorId }: { doctorId: string }) {
  const { appointments, loading } = useAppointments(doctorId)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDetail | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const handleAppointmentClick = async (apt: Appointment) => {
    try {
      setLoadingDetail(true)
      const fullDetail = await appointmentService.getDetailsAppointmentForDoctor(apt.id)
      console.log("Chi tiết appointment",fullDetail)
      setSelectedAppointment(fullDetail)
      setDialogOpen(true)
    } catch (err) {
      console.error("Failed to load appointment detail:", err)
    } finally {
      setLoadingDetail(false)
    }
  }

  return (
    <>
      <CalendarBase
        appointments={appointments}
        loading={loading}
        onAppointmentClick={handleAppointmentClick}
      />

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        loading={loadingDetail}
      />
    </>
  )
}
