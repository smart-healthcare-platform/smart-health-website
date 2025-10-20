import { MedicalRecord } from "./examination"

export interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  patientId: string
  patientName:string
  slotId: string
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show"
  type: "Khám bệnh" | "Tái khám"
  notes: string
  createdAt: string
  updatedAt: string
  startAt:string
}

export interface AppointmentResponse {

  appointments: AppointmentDetail[]
  total: number
  page: number
  limit: number

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
  userId: string
  date: string
  type?: Appointment["type"]
  notes?: string,
  doctorName: string
  startAt:string
}

export interface AppointmentDetail {
  id: string
  doctorId: string
  doctorName: string
  patientId: string
  patientName: string
  slotId: string
  type: string
  status: "pending" | "confirmed" | "cancelled" | "completed" 
  notes?: string
  startAt: string
  createdAt: string
  updatedAt: string
  patient: {
    id: string
    fullName: string
    gender: "male" | "female" | "other"
    dateOfBirth: string
    address: string
  }
  medicalRecord?: MedicalRecord
}

export interface LabTest {
  id: string
  name: string
  code?: string
  description?: string
  price: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
