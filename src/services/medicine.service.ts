import { apiAuth } from '@/lib/axios'
import { 
  PrescriptionSummary, 
  PrescriptionDetail,
  Drug,
  DrugFilters,
  CreatePrescriptionRequest,
  PrescriptionFilters,
  DrugStatistic,
  PrescriptionStatistics,
  MedicineOverviewStats
} from '@/types/medicine';

export const medicineService = {
  // ============================================
  // DRUG CATALOG (READ-ONLY)
  // ============================================
  
  /**
   * Tìm kiếm thuốc trong danh mục
   * @param search - Từ khóa tìm kiếm (tên hoặc hoạt chất)
   * @returns Promise với danh sách thuốc
   */
  searchDrugs: async (search?: string): Promise<Drug[]> => {
    const params = search ? { search } : {};
    const response = await apiAuth.get('/medicine/drugs', { params });
    return response.data; // Backend trả về Drug[] trực tiếp
  },

  /**
   * Lấy tất cả thuốc với pagination (TODO: Backend chưa implement)
   * @param _page - Trang số
   * @param _limit - Số lượng mỗi trang
   * @param filters - Bộ lọc
   */
  getAllDrugs: async (_page = 1, _limit = 10, filters?: DrugFilters): Promise<Drug[]> => {
    // TODO: Chờ backend implement pagination
    // const params = { page: _page, size: _limit, ...filters };
    // const response = await apiAuth.get('/medicine/drugs/list', { params });
    // return response.data;
    
    // Tạm thời dùng search
    return medicineService.searchDrugs(filters?.search);
  },

  /**
   * Lấy chi tiết một thuốc (TODO: Backend chưa implement)
   * @param _id - ID của thuốc
   */
  getDrugById: async (_id: number): Promise<Drug> => {
    // TODO: Chờ backend implement
    // const response = await apiAuth.get(`/medicine/drugs/${_id}`);
    // return response.data;
    throw new Error('API getDrugById chưa được triển khai từ backend');
  },

  // ============================================
  // PRESCRIPTION MANAGEMENT
  // ============================================

  /**
   * Fetches a list of prescriptions for a specific patient.
   * @param patientId The ID of the patient.
   * @returns A promise that resolves to the list of prescriptions.
   */
  getPrescriptionsByPatient: async (patientId: string): Promise<PrescriptionSummary[]> => {
    const response = await apiAuth.get(`/medicine/patients/${patientId}/prescriptions`);
    return response.data;
  },

  /**
   * Fetches the detailed information for a single prescription.
   * @param prescriptionId The ID of the prescription.
   * @returns A promise that resolves to the prescription details.
   */
  getPrescriptionById: async (prescriptionId: string): Promise<PrescriptionDetail> => {
    const response = await apiAuth.get(`/medicine/prescriptions/${prescriptionId}`);
    return response.data;
  },

  /**
   * Tạo đơn thuốc mới
   * @param data - Dữ liệu đơn thuốc
   */
  createPrescription: async (data: CreatePrescriptionRequest): Promise<PrescriptionDetail> => {
    const response = await apiAuth.post('/medicine/prescriptions', data);
    return response.data;
  },

  /**
   * Lấy tất cả đơn thuốc (Admin view) - TODO: Backend chưa implement
   * @param _page - Trang số
   * @param _limit - Số lượng mỗi trang
   * @param _filters - Bộ lọc
   */
  getAllPrescriptions: async (
    _page = 1, 
    _limit = 10, 
    _filters?: PrescriptionFilters
  ): Promise<PrescriptionSummary[]> => {
    // TODO: Chờ backend implement admin view
    // const params = { page: _page, size: _limit, ..._filters };
    // const response = await apiAuth.get('/medicine/prescriptions', { params });
    // return response.data;
    throw new Error('API getAllPrescriptions (Admin view) chưa được triển khai từ backend');
  },

  // ============================================
  // STATISTICS (TODO: Backend chưa implement)
  // ============================================

  /**
   * Lấy top thuốc được kê đơn nhiều nhất
   * @param _limit - Số lượng thuốc
   * @param _startDate - Ngày bắt đầu
   * @param _endDate - Ngày kết thúc
   */
  getTopDrugs: async (
    _limit = 10,
    _startDate?: string,
    _endDate?: string
  ): Promise<DrugStatistic[]> => {
    // TODO: Chờ backend implement
    // const params = { limit: _limit, startDate: _startDate, endDate: _endDate };
    // const response = await apiAuth.get('/medicine/statistics/top-drugs', { params });
    // return response.data;
    throw new Error('API getTopDrugs chưa được triển khai từ backend');
  },

  /**
   * Lấy thống kê tổng quan đơn thuốc
   * @param _startDate - Ngày bắt đầu
   * @param _endDate - Ngày kết thúc
   */
  getPrescriptionStatistics: async (
    _startDate?: string,
    _endDate?: string
  ): Promise<PrescriptionStatistics> => {
    // TODO: Chờ backend implement
    // const params = { startDate: _startDate, endDate: _endDate };
    // const response = await apiAuth.get('/medicine/statistics/prescriptions', { params });
    // return response.data;
    throw new Error('API getPrescriptionStatistics chưa được triển khai từ backend');
  },

  /**
   * Lấy thống kê overview cho dashboard
   */
  getOverviewStats: async (): Promise<MedicineOverviewStats> => {
    // TODO: Chờ backend implement
    // const response = await apiAuth.get('/medicine/statistics/overview');
    // return response.data;
    throw new Error('API getOverviewStats chưa được triển khai từ backend');
  },
};