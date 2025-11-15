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
  patients: any;
  appointments: any;
  doctors: any;
  revenue: any;
  medicine: any;

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
  details?: any;
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
    this.baseURL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';
    
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
        systemHealth,
      ] = await Promise.allSettled([
        this.getDashboardStats(),
        this.getAppointmentTrends('daily', 30),
        this.getAppointmentDistribution(),
        this.getRecentAppointments(1, 10),
        this.getPatientGrowth('daily', 30),
        this.getPatientDemographics(),
        this.getRecentPatients(1, 10),
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