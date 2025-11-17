/**
 * Admin Service
 * Handles all admin dashboard API calls
 */

import axios, { AxiosInstance } from 'axios';
import { store } from '@/redux';

// Types
export interface DashboardStats {
  // Patient metrics
  totalPatients: number;
  activePatients: number;
  newPatientsThisMonth: number;
  newPatientsThisWeek: number;
  patientGrowthRate: number;

  // Appointment metrics
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  scheduledToday: number;
  newAppointmentsThisMonth: number;
  newAppointmentsThisWeek: number;
  averageAppointmentsPerDay: number;
  completionRate: number;
  cancellationRate: number;

  // Revenue metrics
  totalRevenue: number;
  revenueThisMonth: number;
  averageConsultationFee: number;
  mostCommonAppointmentType: string;
  mostCommonAppointmentCategory: string;

  // Doctor metrics
  activeDoctors: number;
  totalDoctors: number;
  onlineDoctors: number;

  // Detailed stats from each service
  patients: Record<string, unknown>;
  appointments: Record<string, unknown>;
  doctors: Record<string, unknown>;
  revenue: Record<string, unknown>;
  medicine: Record<string, unknown>;

  // Service status
  serviceStatus: {
    patients: boolean;
    appointments: boolean;
    doctors: boolean;
    revenue: boolean;
    medicine: boolean;
  };

  // Metadata
  timestamp: string;
  responseTime: number;
  fromCache: boolean;
  partial: boolean;
}

export interface TrendDataPoint {
  date: string;
  count: number;
  completed: number;
  cancelled: number;
  revenue: number;
}

export interface AppointmentTrends {
  period: 'daily' | 'weekly' | 'monthly';
  data: TrendDataPoint[];
  totalAppointments: number;
  totalRevenue: number;
  averagePerPeriod: number;
  percentageChange: number;
  peakDay: string;
  peakCount: number;
  fromCache?: boolean;
}

export interface StatusCount {
  status: string;
  count: number;
  percentage: number;
}

export interface TypeCount {
  type: string;
  count: number;
  percentage: number;
}

export interface CategoryCount {
  category: string;
  count: number;
  percentage: number;
}

export interface PaymentStatusCount {
  paymentStatus: string;
  count: number;
  percentage: number;
  revenue: number;
}

export interface AppointmentDistribution {
  statusDistribution: StatusCount[];
  typeDistribution: TypeCount[];
  categoryDistribution: CategoryCount[];
  paymentDistribution: PaymentStatusCount[];
  totalAppointments: number;
  mostCommonStatus: string;
  mostCommonType: string;
  mostCommonCategory: string;
  mostCommonPaymentStatus: string;
  fromCache?: boolean;
}

export interface RecentAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  status: string;
  type: string;
  category: string;
  startAt: Date;
  endAt: Date | null;
  paymentStatus: string;
  paidAmount: number | null;
  consultationFee: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecentAppointments {
  appointments: RecentAppointment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  fromCache?: boolean;
}

export interface GrowthDataPoint {
  date: string;
  count: number;
  cumulative: number;
}

export interface PatientGrowth {
  period: 'daily' | 'weekly' | 'monthly';
  data: GrowthDataPoint[];
  totalGrowth: number;
  percentageChange: number;
  fromCache?: boolean;
}

export interface AgeGroupDistribution {
  ageGroup: string;
  count: number;
  percentage: number;
}

export interface GenderDistribution {
  gender: string;
  count: number;
  percentage: number;
}

export interface PatientDemographics {
  ageGroups: AgeGroupDistribution[];
  genders: GenderDistribution[];
  averageAge: number;
  medianAge: number;
  totalPatients: number;
  fromCache?: boolean;
}

export interface RecentPatient {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: Date;
  gender: string;
  address: string;
  created_at: Date;
  updated_at: Date;
}

export interface RecentPatients {
  patients: RecentPatient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  fromCache?: boolean;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  details?: Record<string, unknown>;
  error?: string;
  url?: string;
}

export interface SystemHealth {
  services: ServiceHealth[];
  overall: 'healthy' | 'unhealthy' | 'degraded' | 'critical';
  healthyCount: number;
  totalCount: number;
  healthPercentage: number;
  timestamp: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalKeys: number;
}

// Doctor Admin Types
export interface DoctorStats {
  totalDoctors: number;
  activeDoctors: number;
  onlineDoctors: number;
  offlineDoctors: number;
  newDoctorsThisMonth: number;
  newDoctorsThisWeek: number;
  averageRating: number;
  totalAppointments: number;
  totalRevenue: number;
  fromCache?: boolean;
}

export interface SpecialtyDistribution {
  specialty: string;
  count: number;
  percentage: number;
}

export interface DoctorDemographics {
  specialties: SpecialtyDistribution[];
  averageExperience: number;
  mostCommonSpecialty: string;
  totalDoctors: number;
  fromCache?: boolean;
}

export interface DoctorPerformance {
  id: string;
  fullName: string;
  specialty: string;
  experienceYears: number;
  avatar?: string;
  averageRating: number;
  totalRatings: number;
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue?: number;
}

export interface TopDoctors {
  topByRating: DoctorPerformance[];
  topByAppointments: DoctorPerformance[];
  topByRevenue: DoctorPerformance[];
  fromCache?: boolean;
}

export interface RecentDoctor {
  id: string;
  user_id: string;
  full_name: string;
  specialty: string;
  license_number: string;
  experience_years: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface RecentDoctors {
  doctors: RecentDoctor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  fromCache?: boolean;
}

// Billing/Revenue Admin Types
export interface RevenueStats {
  totalRevenue: number;
  todayRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  averagePaymentAmount: number;
  completionRate: number;
  revenueGrowthRate: number;
  paymentGrowthRate: number;
  fromCache?: boolean;
}

export interface PaymentMethodDistribution {
  method: string;
  count: number;
  percentage: number;
  amount: number;
}

export interface PaymentStatusDistribution {
  status: string;
  count: number;
  percentage: number;
  amount: number;
}

export interface RevenueDistribution {
  byPaymentMethod: PaymentMethodDistribution[];
  byStatus: PaymentStatusDistribution[];
  totalRevenue: number;
  mostUsedMethod: string;
  mostCommonStatus: string;
  fromCache?: boolean;
}

export interface RevenueTrendPoint {
  label: string;
  date: string;
  revenue: number;
  paymentCount: number;
  averageAmount: number;
}

export interface RevenueTrends {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  data: RevenueTrendPoint[];
  totalRevenue: number;
  totalTransactions: number;
  averagePerPeriod: number;
  percentageChange: number;
  peakPeriod: string;
  peakRevenue: number;
  fromCache?: boolean;
}

export interface PaymentMethodStats {
  method: string;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalRevenue: number;
  averageTransactionAmount: number;
  successRate: number;
  revenuePercentage: number;
  usagePercentage: number;
}

export interface PaymentMethodsAnalytics {
  methods: PaymentMethodStats[];
  totalMethods: number;
  mostReliableMethod: string;
  mostUsedMethod: string;
  highestRevenueMethod: string;
  fromCache?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    requestId: string;
    responseTime: number;
    timestamp: string;
  };
  message?: string;
  error?: string;
}

class AdminService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Admin API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get authentication token from Redux store or localStorage fallback
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    // Try to get token from Redux store first
    const reduxToken = store.getState().auth.token;
    if (reduxToken) {
      return reduxToken;
    }

    // Fallback to localStorage for development/testing
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  }

  /**
   * Get aggregated dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.api.get<ApiResponse<DashboardStats>>('/v1/admin/dashboard/stats');
    return response.data.data;
  }

  /**
   * Get appointment trends
   * @param period - 'daily', 'weekly', or 'monthly'
   * @param days - Number of days to look back
   */
  async getAppointmentTrends(
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30
  ): Promise<AppointmentTrends> {
    const response = await this.api.get<ApiResponse<AppointmentTrends>>(
      '/v1/admin/dashboard/appointments/trends',
      { params: { period, days } }
    );
    return response.data.data;
  }

  /**
   * Get appointment status distribution
   */
  async getAppointmentDistribution(): Promise<AppointmentDistribution> {
    const response = await this.api.get<ApiResponse<AppointmentDistribution>>(
      '/v1/admin/dashboard/appointments/distribution'
    );
    return response.data.data;
  }

  /**
   * Get recent appointments
   * @param page - Page number
   * @param limit - Items per page
   */
  async getRecentAppointments(
    page: number = 1,
    limit: number = 10
  ): Promise<RecentAppointments> {
    const response = await this.api.get<ApiResponse<RecentAppointments>>(
      '/v1/admin/dashboard/appointments/recent',
      { params: { page, limit } }
    );
    return response.data.data;
  }

  /**
   * Get patient growth trends
   * @param period - 'daily', 'weekly', or 'monthly'
   * @param days - Number of days to look back
   */
  async getPatientGrowth(
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30
  ): Promise<PatientGrowth> {
    const response = await this.api.get<ApiResponse<PatientGrowth>>(
      '/v1/admin/dashboard/patients/growth',
      { params: { period, days } }
    );
    return response.data.data;
  }

  /**
   * Get patient demographics
   */
  async getPatientDemographics(): Promise<PatientDemographics> {
    const response = await this.api.get<ApiResponse<PatientDemographics>>(
      '/v1/admin/dashboard/patients/demographics'
    );
    return response.data.data;
  }

  /**
   * Get recent patients
   * @param page - Page number
   * @param limit - Items per page
   */
  async getRecentPatients(
    page: number = 1,
    limit: number = 10
  ): Promise<RecentPatients> {
    const response = await this.api.get<ApiResponse<RecentPatients>>(
      '/v1/admin/dashboard/patients/recent',
      { params: { page, limit } }
    );
    return response.data.data;
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await this.api.get<ApiResponse<SystemHealth>>(
      '/v1/admin/system/health'
    );
    return response.data.data;
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<CacheStats> {
    const response = await this.api.get<ApiResponse<CacheStats>>(
      '/v1/admin/dashboard/cache-stats'
    );
    return response.data.data;
  }

  /**
   * Force refresh dashboard (invalidate cache)
   */
  async refreshDashboard(): Promise<{ deletedKeys: number; action: string }> {
    const response = await this.api.post<ApiResponse<{ deletedKeys: number; action: string }>>(
      '/v1/admin/dashboard/refresh'
    );
    return response.data.data;
  }

  /**
   * Get doctor statistics
   */
  async getDoctorStats(): Promise<DoctorStats> {
    const response = await this.api.get<ApiResponse<DoctorStats>>(
      '/v1/admin/dashboard/doctors/stats'
    );
    return response.data.data;
  }

  /**
   * Get doctor demographics (specialty distribution)
   * TODO: Not yet implemented in API Gateway
   */
  async getDoctorDemographics(): Promise<DoctorDemographics> {
    const response = await this.api.get<ApiResponse<DoctorDemographics>>(
      '/v1/admin/dashboard/doctors/demographics'
    );
    return response.data.data;
  }

  /**
   * Get top performing doctors
   * @param page - Page number
   * @param limit - Items per page
   */
  async getTopDoctors(
    page: number = 1,
    limit: number = 10
  ): Promise<TopDoctors> {
    const response = await this.api.get<ApiResponse<TopDoctors>>(
      '/v1/admin/dashboard/doctors/top',
      { params: { limit } }
    );
    return response.data.data;
  }

  /**
   * Get recent doctors
   * @param page - Page number
   * @param limit - Items per page
   * TODO: Not yet implemented in API Gateway
   */
  async getRecentDoctors(
    page: number = 1,
    limit: number = 10
  ): Promise<RecentDoctors> {
    const response = await this.api.get<ApiResponse<RecentDoctors>>(
      '/v1/admin/dashboard/doctors/recent',
      { params: { page, limit } }
    );
    return response.data.data;
  }

  /**
   * Get revenue statistics
   */
  async getRevenueStats(): Promise<RevenueStats> {
    const response = await this.api.get<ApiResponse<RevenueStats>>(
      '/v1/admin/dashboard/revenue/stats'
    );
    return response.data.data;
  }

  /**
   * Get revenue distribution
   */
  async getRevenueDistribution(): Promise<RevenueDistribution> {
    const response = await this.api.get<ApiResponse<RevenueDistribution>>(
      '/v1/admin/dashboard/revenue/distribution'
    );
    return response.data.data;
  }

  /**
   * Get revenue trends
   * @param period - 'daily', 'weekly', 'monthly', or 'yearly'
   * @param days - Number of days to look back (for daily/weekly)
   */
  async getRevenueTrends(
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily',
    days?: number
  ): Promise<RevenueTrends> {
    const params: Record<string, string | number> = { period };
    if (days) params.days = days;

    const response = await this.api.get<ApiResponse<RevenueTrends>>(
      '/v1/admin/dashboard/revenue/trends',
      { params }
    );
    return response.data.data;
  }

  /**
   * Get payment methods analytics
   */
  async getPaymentMethodsAnalytics(): Promise<PaymentMethodsAnalytics> {
    const response = await this.api.get<ApiResponse<PaymentMethodsAnalytics>>(
      '/v1/admin/dashboard/payment-methods/stats'
    );
    return response.data.data;
  }

  /**
   * Get all dashboard data at once (for initial load)
   */
  async getAllDashboardData() {
    try {
      const [
        stats,
        appointmentTrends,
        appointmentDistribution,
        recentAppointments,
        patientGrowth,
        patientDemographics,
        recentPatients,
        doctorStats,
        doctorDemographics,
        topDoctors,
        recentDoctors,
        revenueStats,
        revenueDistribution,
        revenueTrends,
        paymentMethodsAnalytics,
        systemHealth,
      ] = await Promise.allSettled([
        this.getDashboardStats(),
        this.getAppointmentTrends('daily', 30),
        this.getAppointmentDistribution(),
        this.getRecentAppointments(1, 10),
        this.getPatientGrowth('daily', 30),
        this.getPatientDemographics(),
        this.getRecentPatients(1, 10),
        this.getDoctorStats(),
        this.getDoctorDemographics(),
        this.getTopDoctors(1, 10),
        this.getRecentDoctors(1, 10),
        this.getRevenueStats(),
        this.getRevenueDistribution(),
        this.getRevenueTrends('daily', 30),
        this.getPaymentMethodsAnalytics(),
        this.getSystemHealth(),
      ]);

      return {
        stats: stats.status === 'fulfilled' ? stats.value : null,
        appointmentTrends: appointmentTrends.status === 'fulfilled' ? appointmentTrends.value : null,
        appointmentDistribution: appointmentDistribution.status === 'fulfilled' ? appointmentDistribution.value : null,
        recentAppointments: recentAppointments.status === 'fulfilled' ? recentAppointments.value : null,
        patientGrowth: patientGrowth.status === 'fulfilled' ? patientGrowth.value : null,
        patientDemographics: patientDemographics.status === 'fulfilled' ? patientDemographics.value : null,
        recentPatients: recentPatients.status === 'fulfilled' ? recentPatients.value : null,
        doctorStats: doctorStats.status === 'fulfilled' ? doctorStats.value : null,
        doctorDemographics: doctorDemographics.status === 'fulfilled' ? doctorDemographics.value : null,
        topDoctors: topDoctors.status === 'fulfilled' ? topDoctors.value : null,
        recentDoctors: recentDoctors.status === 'fulfilled' ? recentDoctors.value : null,
        revenueStats: revenueStats.status === 'fulfilled' ? revenueStats.value : null,
        revenueDistribution: revenueDistribution.status === 'fulfilled' ? revenueDistribution.value : null,
        revenueTrends: revenueTrends.status === 'fulfilled' ? revenueTrends.value : null,
        paymentMethodsAnalytics: paymentMethodsAnalytics.status === 'fulfilled' ? paymentMethodsAnalytics.value : null,
        systemHealth: systemHealth.status === 'fulfilled' ? systemHealth.value : null,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }
}

// Export singleton instance
const adminService = new AdminService();
export default adminService;