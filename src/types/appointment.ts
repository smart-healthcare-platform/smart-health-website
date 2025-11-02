import { Appointment, AppointmentDetail } from "./appointment/appointment.type";

// Payment Status Type
export type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "REFUNDED";

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
