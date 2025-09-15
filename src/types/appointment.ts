import { Patient } from "./patient"

export interface Appointment {
  id: string
  patientId: string
  patient: Patient

  // Scheduling
  date: string
  startTime: string
  endTime: string
  duration: number // in minutes

  // Appointment Details
  type: "consultation" | "follow-up" | "checkup" | "surgery" | "emergency"
  reason: string
  notes?: string
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show"

  // Provider & Location
  doctorId: string
  doctorName: string
  department: string
  roomNumber?: string

  // Integration
  googleEventId?: string
  googleCalendarId?: string

  // System fields
  createdAt: string
  updatedAt: string
}

export type ViewMode = "table" | "calendar"

export interface AppointmentFilters {
  dateRange: {
    start: string
    end: string
  }
  status?: Appointment["status"][]
  type?: Appointment["type"][]
  doctorId?: string
  department?: string
}
export interface CreateAppointmentPayload {
  doctorId: string
  slotId: string
  patientId: string
  date: string
  reason: string
  type?: Appointment["type"]
  notes?: string
}