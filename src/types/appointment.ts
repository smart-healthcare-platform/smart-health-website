export interface Appointment {
  id: string
  title: string
  patient: string
  phone: string
  email?: string
  date: string
  startTime: string
  endTime: string
  type: "Khám định kỳ" | "Tái khám" | "Khám mới" | "Tư vấn" | "Phẫu thuật"
  status: "confirmed" | "pending" | "cancelled" | "completed"
  notes?: string
  doctorId?: string
  roomId?: string
  // Google Calendar integration fields
  googleEventId?: string
  googleCalendarId?: string
  createdAt: string
  updatedAt: string
}

export interface AppointmentFilters {
  dateRange: {
    start: string
    end: string
  }
  status?: Appointment["status"][]
  type?: Appointment["type"][]
  doctorId?: string
}

export type ViewMode = "table" | "calendar"
