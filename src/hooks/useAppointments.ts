"use client"

import { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
// import { RootState } from "@/store"
import { appointmentService } from "@/services/appointment.service"
import type { Appointment, AppointmentResponse } from "@/types/appointment"

export function useAppointments(doctorId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>()
  const [loading, setLoading] = useState(false)

  const loadAppointments = useCallback(async () => {
    if (!doctorId) return
    setLoading(true)
    try {
      const res = await appointmentService.getByDoctorId(doctorId)
      setAppointments(res.appointments)
    } finally {
      setLoading(false)
    }
  }, [doctorId])

  // const updateAppointment = async (id: string, data: Partial<Appointment>) => {
  //   await appointmentService.updateAppointment(id, data)
  //   await loadAppointments()
  // }

  // const deleteAppointment = async (id: string) => {
  //   await appointmentService.deleteAppointment(id)
  //   await loadAppointments()
  // }

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  return { appointments, loading}
}
