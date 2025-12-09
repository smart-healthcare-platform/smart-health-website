// Payment-related types for Billing Service integration

export type PaymentMethodType = "MOMO" | "VNPAY" | "CASH" | "COD";
export type PaymentType = "APPOINTMENT_FEE" | "LAB_TEST" | "PRESCRIPTION" | "OTHER";
export type PaymentStatus = "PENDING" | "PROCESSING" | "PAID" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED" | "UNPAID";

/**
 * Single payment item in outstanding payments list
 */
export interface PaymentItem {
  paymentCode: string;
  paymentType: PaymentType;
  amount: number;
  status: PaymentStatus;
  description?: string;
  createdAt: string;
  paidAt?: string;
  appointmentId?: string; // For grouping payments by appointment
}

/**
 * Response containing all payments (paid and unpaid) for an appointment
 * Used to display consolidated invoice for receptionist
 */
export interface OutstandingPaymentResponse {
  appointmentId: string;
  patientName?: string;
  totalUnpaid: number;
  totalPaid: number;
  payments: PaymentItem[];
}

/**
 * Request to pay multiple payments at once
 * Used by receptionist for bulk payment processing
 */
export interface BulkPaymentRequest {
  paymentCodes: string[];
  paymentMethod: PaymentMethodType;
  totalAmount: number;
  notes?: string;
}

/**
 * Response from bulk payment processing
 */
export interface BulkPaymentResponse {
  message: string;
  paymentCount: string;
  totalAmount: string;
}

/**
 * Existing payment response interface (keep for backward compatibility)
 */
export interface PaymentResponse {
  paymentCode: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  paymentType: PaymentType;
  status: PaymentStatus;
  paymentUrl?: string;
  referenceId: string;
  appointmentId?: string; // For grouping payments by appointment
  createdAt: string;
  paidAt?: string;
  transactionId?: string;
}
