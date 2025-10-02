"use client"

import { useState, useEffect, useCallback } from "react"
import { appointmentService } from "@/services/appointment.service"
import type { Appointment } from "@/types/appointment"

export function useAppointments(doctorId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)

  const loadAppointments = useCallback(async () => {
    if (!doctorId) return
    setLoading(true)
    try {
      const res = await appointmentService.getByDoctorId(doctorId)
      console.log("📌 appointments:", res)
      setAppointments(res)
    } catch (err) {
      console.error("Lỗi load appointments:", err)
    } finally {
      setLoading(false)
    }
  }, [doctorId])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  return { appointments, loading }
}
