import { MedicalRecord } from "./examination"

// Appointment Status Types
export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

// Payment Status Type
export type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "REFUNDED";

export interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  patientId: string
  patientName: string
  slotId: string
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show" | "checked_in"
  type: "Khám bệnh" | "Tái khám"
  notes: string
  createdAt: string
  updatedAt: string
  startAt: string
  // Payment & Check-in fields
  paymentStatus?: PaymentStatus
  paymentId?: string | null
  paidAmount?: string | null
  paidAt?: string | null
  checkedInAt?: string | null
  consultationFee?: string
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
  status: "pending" | "confirmed" | "cancelled" | "completed" | "in-progress"
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
  
  // 🆕 Payment fields (sync with backend)
  paymentStatus?: "UNPAID" | "PENDING" | "PAID" | "REFUNDED"
  paymentId?: string | null
  paidAmount?: number | null
  paidAt?: string | null
  checkedInAt?: string | null
  consultationFee?: number
}

// 🆕 Payment API Request/Response Types
export interface CreatePaymentRequest {
  paymentMethod: "MOMO" | "VNPAY"
}

export interface CreatePaymentResponse {
  success: boolean
  appointmentId: string
  paymentId: string
  paymentUrl: string
  amount: number
  expiredAt: string
}

export interface CheckInRequest {
  notes?: string
}

export interface CheckInResponse {
  success: boolean
  message: string
  appointmentId: string
  checkedInAt: string // ✅ Thời gian check-in chính xác
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "REFUNDED" // ✅ Payment status
  requiresPayment: boolean // ✅ Flag để frontend biết cần thu tiền
  appointment: AppointmentDetail
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
