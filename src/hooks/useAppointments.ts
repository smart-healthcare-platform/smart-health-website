"use client"

import { useState, useEffect } from "react"
import type { Appointment, AppointmentFilters } from "@/types/appointment"

// Mock data - replace with actual API calls
const mockAppointments: Appointment[] = [
  {
    id: "1",
    title: "Khám định kỳ - Nguyễn Thị Lan",
    patient: "Nguyễn Thị Lan",
    phone: "0901234567",
    email: "lan.nguyen@email.com",
    date: "2024-01-15",
    startTime: "08:00",
    endTime: "08:30",
    type: "Khám định kỳ",
    status: "confirmed",
    notes: "Kiểm tra huyết áp",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Tái khám - Trần Văn Nam",
    patient: "Trần Văn Nam",
    phone: "0912345678",
    email: "nam.tran@email.com",
    date: "2024-01-15",
    startTime: "08:30",
    endTime: "09:00",
    type: "Tái khám",
    status: "confirmed",
    notes: "Theo dõi sau phẫu thuật",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    title: "Khám mới - Lê Thị Hoa",
    patient: "Lê Thị Hoa",
    phone: "0923456789",
    email: "hoa.le@email.com",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "09:30",
    type: "Khám mới",
    status: "pending",
    notes: "Đau ngực, khó thở",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
]

export function useAppointments(filters?: AppointmentFilters) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate API call
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        let filteredAppointments = [...mockAppointments]

        if (filters) {
          // Apply filters
          if (filters.status && filters.status.length > 0) {
            filteredAppointments = filteredAppointments.filter((apt) => filters.status!.includes(apt.status))
          }

          if (filters.type && filters.type.length > 0) {
            filteredAppointments = filteredAppointments.filter((apt) => filters.type!.includes(apt.type))
          }

          if (filters.dateRange) {
            filteredAppointments = filteredAppointments.filter(
              (apt) => apt.date >= filters.dateRange.start && apt.date <= filters.dateRange.end,
            )
          }
        }

        setAppointments(filteredAppointments)
        setError(null)
      } catch (err) {
        setError("Không thể tải danh sách lịch hẹn")
        console.error("Error fetching appointments:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [filters])

  // Functions for Google Calendar integration (to be implemented)
  const syncWithGoogleCalendar = async (appointmentId: string) => {
    // TODO: Implement Google Calendar sync
    console.log("Syncing appointment with Google Calendar:", appointmentId)
  }

  const createAppointment = async (appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
    // TODO: Implement create appointment API call
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setAppointments((prev) => [...prev, newAppointment])
    return newAppointment
  }

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    // TODO: Implement update appointment API call
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updates, updatedAt: new Date().toISOString() } : apt)),
    )
  }

  const deleteAppointment = async (id: string) => {
    // TODO: Implement delete appointment API call
    setAppointments((prev) => prev.filter((apt) => apt.id !== id))
  }

  return {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    syncWithGoogleCalendar,
  }
}
