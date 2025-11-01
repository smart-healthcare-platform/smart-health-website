import { apiAuth } from "@/lib/axios";

export type PaymentMethodType = "MOMO" | "VNPAY" | "CASH" | "COD";
export type PaymentType = "APPOINTMENT_FEE" | "LAB_TEST" | "PRESCRIPTION" | "OTHER";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED";

export interface CreatePaymentRequest {
  paymentType: PaymentType;
  referenceId: string; // appointmentId
  amount: number;
  paymentMethod: PaymentMethodType;
}

export interface CashPaymentRequest {
  appointmentId: string;
  amount: number;
  paymentType: "CONSULTATION" | "MEDICATION" | "PROCEDURE" | "OTHER";
  notes?: string;
}

export interface PaymentResponse {
  paymentCode: string; // Dùng paymentCode (string) thay vì id (number)
  amount: number;
  paymentMethod: PaymentMethodType;
  paymentType: PaymentType;
  status: PaymentStatus;
  paymentUrl?: string; // Cho MOMO/VNPAY
  referenceId: string; // appointmentId
  createdAt: string;
  paidAt?: string;
  transactionId?: string;
}

export const billingService = {
  /**
   * Tạo payment request (MOMO/VNPAY/COD)
   * Trả về payment URL để redirect hoặc hiển thị QR
   */
  async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
    // Gọi qua appointment service thay vì billing service trực tiếp
    const response = await apiAuth.post<{
      success: boolean;
      appointmentId: string;
      paymentId: string;
      paymentUrl: string;
      amount: number;
      expiredAt: string;
    }>(
      `/appointments/${request.referenceId}/create-payment`,
      { paymentMethod: request.paymentMethod }
    );
    
    console.log("🔍 Create payment response from backend:", response.data);
    
    if (!response.data.success) {
      throw new Error("Failed to create payment");
    }
    
    // Map CreatePaymentResponse từ appointment service sang PaymentResponse
    const mappedPayment: PaymentResponse = {
      paymentCode: response.data.paymentId, // paymentId là string (PAY-xxxxx)
      amount: response.data.amount || request.amount, // Fallback về amount từ request nếu backend không trả về
      paymentMethod: request.paymentMethod,
      paymentType: request.paymentType,
      status: "PENDING",
      paymentUrl: response.data.paymentUrl,
      referenceId: response.data.appointmentId,
      createdAt: new Date().toISOString(),
    };
    
    console.log("✅ Mapped payment object:", mappedPayment);
    
    return mappedPayment;
  },

  /**
   * Tạo thanh toán tiền mặt (dành cho receptionist)
   */
  async createCashPayment(request: CashPaymentRequest): Promise<PaymentResponse> {
    const response = await apiAuth.post<{ success: boolean; data: PaymentResponse }>(
      "/billing/billings/cash",
      request
    );
    
    if (!response.data.success) {
      throw new Error("Failed to create cash payment");
    }
    
    return response.data.data;
  },
};
