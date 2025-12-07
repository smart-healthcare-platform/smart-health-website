"use client"

import { useState } from "react"
import { CalendarBase } from "./calendar-base"
import AppointmentDetailDialog from "@/components/common/appointment-detail-dialog"
import { appointmentService } from "@/services/appointment.service"
import { Appointment, AppointmentDetail } from "@/types/appointment/appointment.type"

interface Props {
  appointments: Appointment[]
  loading?: boolean
}

export function AppointmentCalendar({ appointments, loading = false }: Props) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDetail | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const handleAppointmentClick = async (apt: Appointment) => {
    try {
      setLoadingDetail(true)
      const fullDetail = await appointmentService.getDetailsAppointmentForDoctor(apt.id)
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
