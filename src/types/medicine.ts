// ============================================
// ENUMS
// ============================================

/**
 * Stock status từ nhà thuốc partner
 */
export enum StockStatus {
  IN_STOCK = "IN_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  LOW_STOCK = "LOW_STOCK"
}

/**
 * Trạng thái đơn thuốc
 */
export enum PrescriptionStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

// ============================================
// DRUG (Thuốc - READ-ONLY từ Pharmacy API)
// ============================================

/**
 * Drug entity - Danh mục thuốc từ nhà thuốc partner
 */
export interface Drug {
  id: number;
  name: string;                    // Tên thương mại
  activeIngredient: string;        // Hoạt chất
  strength: string;                // Hàm lượng (vd: "500mg")
  stockStatus: StockStatus;        // Trạng thái tồn kho
}

/**
 * Drug filters cho tìm kiếm và lọc
 */
export interface DrugFilters {
  search?: string;
  stockStatus?: StockStatus | 'all';
}

/**
 * Pagination response cho drug list
 */
export interface DrugPaginatedResponse {
  content: Drug[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ============================================
// PRESCRIPTION (Đơn thuốc)
// ============================================

/**
 * Prescription Summary - Dùng cho danh sách
 * Backend response: PrescriptionSummaryDto.java
 */
export interface PrescriptionSummary {
  id: string;
  patientId: string;
  appointmentId: string;
  diagnosis: string;
  status: PrescriptionStatus;
  createdAt: string; // ISO 8601 date string
}

/**
 * Prescription Item - Chi tiết thuốc trong đơn
 * Backend response: PrescriptionItemDto.java
 */
export interface PrescriptionItem {
  id?: number;                     // Optional khi create
  drugId: number;
  drugName?: string;               // Populated khi fetch
  dosage: string;                  // Liều dùng (vd: "1 viên")
  frequency: string;               // Tần suất (vd: "2 lần/ngày")
  route?: string;                  // Đường dùng (vd: "Uống")
  timing?: string;                 // Thời điểm (vd: "Sau ăn")
  durationDays?: number;           // Thời gian dùng (số ngày)
}

/**
 * Prescription Detail - Chi tiết đầy đủ đơn thuốc
 * Backend response: PrescriptionDetailDto.java
 */
export interface PrescriptionDetail {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  diagnosis: string;
  notes: string;
  status: PrescriptionStatus;
  createdAt: string; // ISO 8601 date string
  items: PrescriptionItem[];
}

/**
 * Request để tạo đơn thuốc mới
 * Backend request: CreatePrescriptionRequest.java
 */
export interface CreatePrescriptionRequest {
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  diagnosis?: string;
  notes?: string;
  items: PrescriptionItemInput[];
}

/**
 * Input cho prescription item khi tạo mới
 */
export interface PrescriptionItemInput {
  drugId: number;
  dosage: string;
  frequency: string;
  route?: string;
  timing?: string;
  durationDays?: number;
}

/**
 * Prescription filters cho admin view
 */
export interface PrescriptionFilters {
  doctorId?: string;
  patientId?: string;
  status?: PrescriptionStatus | 'all';
  startDate?: string;
  endDate?: string;
}

/**
 * Pagination response cho prescription list
 */
export interface PrescriptionPaginatedResponse {
  content: PrescriptionSummary[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ============================================
// STATISTICS (Thống kê)
// ============================================

/**
 * Thống kê thuốc được kê nhiều nhất
 */
export interface DrugStatistic {
  drugId: number;
  drugName: string;
  activeIngredient: string;
  prescriptionCount: number;
  totalQuantity: number;
}

/**
 * Thống kê tổng quan đơn thuốc
 */
export interface PrescriptionStatistics {
  totalPrescriptions: number;
  pendingPayment: number;
  completed: number;
  cancelled: number;
  completionRate: number; // Phần trăm
}

/**
 * Thống kê overview cho dashboard
 */
export interface MedicineOverviewStats {
  totalDrugs: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalPrescriptions: number;
  prescriptionsThisMonth: number;
}