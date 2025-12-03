import { apiAuth } from "@/lib/axios";
import type {
  OutstandingPaymentResponse,
  BulkPaymentRequest,
  BulkPaymentResponse,
} from "@/types/billing";

export interface PaymentSearchParams {
  startDate?: string; // yyyy-MM-dd
  endDate?: string;   // yyyy-MM-dd
  status?: PaymentStatus;
  paymentMethod?: PaymentMethodType;
  paymentType?: PaymentType;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export type PaymentMethodType = "MOMO" | "VNPAY" | "CASH" | "COD";
export type PaymentType = "APPOINTMENT_FEE" | "LAB_TEST" | "PRESCRIPTION" | "OTHER";
export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED";

export interface CreatePaymentRequest {
  paymentType: PaymentType;
  referenceId: string; // appointmentId
  amount: number;
  paymentMethod: PaymentMethodType;
}

export interface CashPaymentRequest {
  referenceId: string; // appointmentId, labTestId, etc.
  amount: number;
  paymentType: PaymentType; // Use PaymentType enum to match backend
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
    const response = await apiAuth.post<PaymentResponse>(
      "/billings/cash-payment",
      request
    );
    
    return response.data;
  },

  /**
   * Tìm kiếm payments với filters
   */
  async searchPayments(params: PaymentSearchParams): Promise<PageResponse<PaymentResponse>> {
    const response = await apiAuth.get<PageResponse<PaymentResponse>>(
      "/billings/search",
      { params }
    );
    return response.data;
  },

  /**
   * Lấy payments hôm nay
   */
  async getTodayPayments(status?: PaymentStatus): Promise<PaymentResponse[]> {
    console.log(`🌐 [BILLING SERVICE] Calling GET /billings/today with status: ${status || 'undefined'}`);
    
    const response = await apiAuth.get<PaymentResponse[]>(
      "/billings/today",
      { params: { status } }
    );
    
    console.log(`✅ [BILLING SERVICE] Received ${response.data.length} payments from API`);
    console.log(`   Response data:`, response.data);
    
    return response.data;
  },

  /**
   * Lấy payment theo appointmentId
   */
  async getByAppointmentId(appointmentId: string): Promise<PaymentResponse> {
    const response = await apiAuth.get<PaymentResponse>(
      `/billings/by-appointment/${appointmentId}`
    );
    return response.data;
  },

  /**
   * Lấy payment theo referenceId
   */
  async getByReferenceId(referenceId: string, paymentType?: PaymentType): Promise<PaymentResponse> {
    const response = await apiAuth.get<PaymentResponse>(
      `/billings/by-reference/${referenceId}`,
      { params: { paymentType } }
    );
    return response.data;
  },

  /**
   * Lấy danh sách thanh toán chưa thanh toán (outstanding payments) cho một hoặc nhiều appointmentId
   * @param referenceIds - Danh sách appointmentId cần kiểm tra
   * @returns Thông tin tổng hợp thanh toán chưa thanh toán và đã thanh toán
   */
  async getOutstandingPayments(referenceIds: string[]): Promise<OutstandingPaymentResponse> {
    if (!referenceIds || referenceIds.length === 0) {
      throw new Error("referenceIds is required and must not be empty");
    }

    const response = await apiAuth.get<OutstandingPaymentResponse>(
      "/billings/outstanding",
      { 
        params: { referenceIds: referenceIds.join(",") }
      }
    );
    
    return response.data;
  },

  /**
   * Xử lý thanh toán hàng loạt (bulk payment) cho nhiều payment cùng lúc
   * @param request - Thông tin thanh toán hàng loạt
   * @returns Kết quả thanh toán
   */
  async processBulkPayment(request: BulkPaymentRequest): Promise<BulkPaymentResponse> {
    if (!request.paymentCodes || request.paymentCodes.length === 0) {
      throw new Error("paymentCodes is required and must not be empty");
    }

    if (request.totalAmount <= 0) {
      throw new Error("totalAmount must be greater than 0");
    }

    const response = await apiAuth.post<BulkPaymentResponse>(
      "/billings/bulk-payment",
      request
    );
    
    return response.data;
  },
};
