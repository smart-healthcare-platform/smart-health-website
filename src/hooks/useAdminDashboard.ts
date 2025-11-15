/**
 * Custom hooks for Admin Dashboard
 * Uses React Query for data fetching and caching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '@/services/admin.service';

// Query keys
export const QUERY_KEYS = {
  DASHBOARD_STATS: ['admin', 'dashboard', 'stats'],
  APPOINTMENT_TRENDS: ['admin', 'appointments', 'trends'],
  APPOINTMENT_DISTRIBUTION: ['admin', 'appointments', 'distribution'],
  RECENT_APPOINTMENTS: ['admin', 'appointments', 'recent'],
  PATIENT_GROWTH: ['admin', 'patients', 'growth'],
  PATIENT_DEMOGRAPHICS: ['admin', 'patients', 'demographics'],
  RECENT_PATIENTS: ['admin', 'patients', 'recent'],
  SYSTEM_HEALTH: ['admin', 'system', 'health'],
  CACHE_STATS: ['admin', 'cache', 'stats'],
};

/**
 * Hook to get dashboard statistics
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_STATS,
    queryFn: () => adminService.getDashboardStats(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every 1 minute
  });
}

/**
 * Hook to get appointment trends
 */
export function useAppointmentTrends(
  period: 'daily' | 'weekly' | 'monthly' = 'daily',
  days: number = 30
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.APPOINTMENT_TRENDS, period, days],
    queryFn: () => adminService.getAppointmentTrends(period, days),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get appointment distribution
 */
export function useAppointmentDistribution() {
  return useQuery({
    queryKey: QUERY_KEYS.APPOINTMENT_DISTRIBUTION,
    queryFn: () => adminService.getAppointmentDistribution(),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get recent appointments
 */
export function useRecentAppointments(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECENT_APPOINTMENTS, page, limit],
    queryFn: () => adminService.getRecentAppointments(page, limit),
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true,
  });
}

/**
 * Hook to get patient growth
 */
export function usePatientGrowth(
  period: 'daily' | 'weekly' | 'monthly' = 'daily',
  days: number = 30
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PATIENT_GROWTH, period, days],
    queryFn: () => adminService.getPatientGrowth(period, days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get patient demographics
 */
export function usePatientDemographics() {
  return useQuery({
    queryKey: QUERY_KEYS.PATIENT_DEMOGRAPHICS,
    queryFn: () => adminService.getPatientDemographics(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get recent patients
 */
export function useRecentPatients(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECENT_PATIENTS, page, limit],
    queryFn: () => adminService.getRecentPatients(page, limit),
    staleTime: 60 * 1000, // 1 minute
    keepPreviousData: true,
  });
}

/**
 * Hook to get system health
 */
export function useSystemHealth() {
  return useQuery({
    queryKey: QUERY_KEYS.SYSTEM_HEALTH,
    queryFn: () => adminService.getSystemHealth(),
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

/**
 * Hook to get cache statistics
 */
export function useCacheStats() {
  return useQuery({
    queryKey: QUERY_KEYS.CACHE_STATS,
    queryFn: () => adminService.getCacheStats(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to refresh dashboard (invalidate cache)
 */
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminService.refreshDashboard(),
    onSuccess: () => {
      // Invalidate all dashboard queries
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}

/**
 * Hook to get all dashboard data at once
 */
export function useAllDashboardData() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'all'],
    queryFn: () => adminService.getAllDashboardData(),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to manually refetch all dashboard data
 */
export function useRefetchDashboard() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENT_TRENDS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENT_DISTRIBUTION });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECENT_APPOINTMENTS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENT_GROWTH });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENT_DEMOGRAPHICS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECENT_PATIENTS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SYSTEM_HEALTH });
  };
}