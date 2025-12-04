import { apiAuth as api } from "@/lib/axios";
import { CheckInResponse } from "@/types/appointment";
import { AppointmentStatus } from "@/types/appointment/enums/appointment-status.enum";
import { Appointment } from "@/types/appointment/appointment.type";

export interface ReceptionistAppointmentFilters {
  status?: string;
  paymentStatus?: string;
  daysOffset?: number;
}

export interface UpdateStatusRequest {
  status: AppointmentStatus;
}

export interface CashPaymentRequest {
  appointmentId: string;
  amount: number;
  paymentType: "CONSULTATION" | "MEDICATION" | "PROCEDURE" | "OTHER";
  notes?: string;
}

export interface CashPaymentResponse {
  paymentCode: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paidAt: string;
}

export interface PaymentTypeBreakdown {
  paymentType: string;
  revenue: number;
  transactionCount: number;
  percentage: number;
}

export interface PaymentMethodBreakdown {
  paymentMethod: string;
  revenue: number;
  transactionCount: number;
  percentage: number;
}

export interface DailyStatistics {
  date: string;
  totalRevenue: number;
  totalTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  paymentTypeBreakdown: PaymentTypeBreakdown[];
  paymentMethodBreakdown: PaymentMethodBreakdown[];
  cashRevenue: number;
  onlineRevenue: number;
  averageTransactionAmount: number;
}

export const receptionistService = {
  /**
   * Lấy danh sách appointments trong ngày
   * @param filters - Filters (status, paymentStatus, daysOffset)
   */
  getTodayAppointments: async (
    filters?: ReceptionistAppointmentFilters
  ): Promise<Appointment[]> => {
    const params = new URLSearchParams();
    
    if (filters?.status) {
      params.append("status", filters.status);
    }
    if (filters?.paymentStatus) {
      params.append("paymentStatus", filters.paymentStatus);
    }
    if (filters?.daysOffset !== undefined) {
      params.append("daysOffset", filters.daysOffset.toString());
    }

    const queryString = params.toString();
    const url = `/appointments/receptionist/today${queryString ? `?${queryString}` : ""}`;
    
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Tìm kiếm appointment theo keyword
   * @param keyword - Tên bệnh nhân, ID appointment, hoặc patient ID
   */
  searchAppointments: async (keyword: string): Promise<Appointment[]> => {
    if (!keyword || keyword.trim().length === 0) {
      return [];
    }

    const response = await api.get(
      `/appointments/receptionist/search?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data;
  },

  /**
   * Cập nhật status của appointment
   * @param appointmentId - ID của appointment
   * @param status - Status mới (CHECKED_IN, COMPLETED, CANCELLED, etc.)
   */
  updateAppointmentStatus: async (
    appointmentId: string,
    status: AppointmentStatus
  ): Promise<Appointment> => {
    const response = await api.post(
      `/appointments/receptionist/${appointmentId}/update-status`,
      { status }
    );
    return response.data;
  },

  /**
   * Thanh toán tiền mặt tại quầy
   * @param paymentData - Thông tin thanh toán
   */
  createCashPayment: async (
    paymentData: CashPaymentRequest
  ): Promise<CashPaymentResponse> => {
    // Map frontend types to backend types
    const mappedData = {
      referenceId: paymentData.appointmentId,
      amount: paymentData.amount,
      paymentType: paymentData.paymentType === "CONSULTATION" ? "APPOINTMENT_FEE" : "LAB_TEST",
      notes: paymentData.notes,
    };
    
    const response = await api.post("/billings/cash-payment", mappedData);
    return response.data;
  },

  /**
   * Check-in bệnh nhân tại cơ sở y tế
   * ✅ GỌI ĐÚNG ENDPOINT để cập nhật checkedInAt
   * @param appointmentId - ID của appointment
   * @param notes - Ghi chú khi check-in (optional)
   */
  checkInPatient: async (
    appointmentId: string,
    notes?: string
  ): Promise<CheckInResponse> => {
    const response = await api.post(
      `/appointments/${appointmentId}/check-in`,
      notes ? { notes } : {}
    );
    return response.data;
  },

  /**
   * Lấy thống kê doanh thu theo ngày cho receptionist
   * @param date - Ngày cần thống kê (YYYY-MM-DD), mặc định là hôm nay
   */
  getDailyStatistics: async (date?: string): Promise<DailyStatistics> => {
    const params = date ? `?date=${date}` : "";
    const response = await api.get(`/billings/receptionist/daily-statistics${params}`);
    return response.data.data;
  },

  /**
   * Lấy tóm tắt nhanh doanh thu hôm nay
   */
  getTodaySummary: async (): Promise<DailyStatistics> => {
    const response = await api.get("/billings/receptionist/today-summary");
    return response.data.data;
  },
};
