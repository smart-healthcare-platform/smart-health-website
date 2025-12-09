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
 * 
 * LƯU Ý: Hệ thống KHÔNG bán thuốc trực tiếp.
 * Đơn thuốc chỉ được in ra để bệnh nhân mua tại nhà thuốc liên kết.
 */
export enum PrescriptionStatus {
  /** Đơn đang được bác sĩ soạn (chưa hoàn tất khám) */
  DRAFT = "DRAFT",
  /** Đơn đã được tạo, bệnh nhân có thể lấy đơn tại quầy */
  ACTIVE = "ACTIVE",
  /** Đơn đã được in và trao cho bệnh nhân */
  PRINTED = "PRINTED",
  /** Đơn đã bị hủy */
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
 * Medication History - Lịch sử dùng thuốc của bệnh nhân
 * Backend response: MedicationHistoryDto.java
 * Dùng để bác sĩ xem lịch sử kê đơn khi khám bệnh
 */
export interface MedicationHistory {
  prescriptionId: string;
  appointmentId: string;
  prescribedDate: string;       // ISO 8601 date string
  diagnosis: string;
  doctorName?: string;
  notes?: string;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
  totalDrugs: number;           // Số loại thuốc trong đơn
}

/**
 * Drug Frequency - Thống kê tần suất dùng thuốc
 * Backend response: DrugFrequencyDto.java
 */
export interface DrugFrequency {
  drugId: number;
  drugName: string;
  activeIngredient: string;
  strength: string;
  prescriptionCount: number;    // Số lần được kê
  lastPrescribed: string;       // ISO 8601 date string
  firstPrescribed: string;      // ISO 8601 date string
  mostCommonDosage?: string;    // Liều dùng phổ biến nhất
}

// ============================================
// PRESCRIPTION TEMPLATES (Mẫu đơn thuốc)
// ============================================

/**
 * Template Item - Thuốc trong mẫu đơn
 * Backend response: PrescriptionTemplateItemDto.java
 */
export interface PrescriptionTemplateItem {
  id?: number;
  drugId: number;
  drugName: string;
  activeIngredient: string;
  strength: string;
  dosage: string;
  frequency: string;
  route?: string;
  timing?: string;
  durationDays?: number;
  specialInstructions?: string;
}

/**
 * Prescription Template - Mẫu đơn thuốc
 * Backend response: PrescriptionTemplateDto.java
 */
export interface PrescriptionTemplate {
  id: number;
  doctorId: string;
  templateName: string;
  diagnosis?: string;
  notes?: string;
  items: PrescriptionTemplateItem[];
  createdAt: string;
  updatedAt: string;
  totalDrugs: number;
}

/**
 * Template Item Input - Dữ liệu thuốc khi tạo/sửa mẫu
 * Backend request: TemplateItemInput.java
 */
export interface TemplateItemInput {
  drugId: number;
  dosage: string;
  frequency: string;
  route?: string;
  timing?: string;
  durationDays?: number;
  specialInstructions?: string;
}

/**
 * Create Template Request - Tạo mẫu đơn mới
 * Backend request: CreateTemplateRequest.java
 */
export interface CreateTemplateRequest {
  templateName: string;
  diagnosis?: string;
  notes?: string;
  items: TemplateItemInput[];
}

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
  quantity?: string;               // Số lượng
  instructions?: string;           // Hướng dẫn chi tiết
  frequency: string;               // Tần suất (vd: "2 lần/ngày")
  route?: string;                  // Đường dùng (vd: "Uống")
  timing?: string;                 // Thời điểm (vd: "Sau ăn")
  durationDays?: number;           // Thời gian dùng (số ngày)
  notes?: string;                  // Ghi chú
}

/**
 * Prescription Detail - Chi tiết đầy đủ đơn thuốc
 * Backend response: PrescriptionDetailDto.java
 */
export interface PrescriptionDetail {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
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
 * Response khi tạo đơn thuốc thành công
 * Backend response: PrescriptionResponse.java
 */
export interface PrescriptionResponse {
  prescriptionId: string;
  status: PrescriptionStatus;
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