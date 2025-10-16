import { useState, useEffect, useCallback } from 'react';
import { medicineService } from '@/services/medicine.service';
import { Drug, DrugFilters, StockStatus } from '@/types/medicine';
import { toast } from 'react-toastify';

/**
 * Custom hook để quản lý drug catalog (READ-ONLY)
 */
export function useDrugs(initialFilters?: DrugFilters) {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DrugFilters>(initialFilters || {});

  // Fetch drugs từ API
  const fetchDrugs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await medicineService.searchDrugs(filters.search);
      setDrugs(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách thuốc';
      setError(errorMessage);
      toast.error(errorMessage);
      setDrugs([]);
    } finally {
      setLoading(false);
    }
  }, [filters.search]);

  // Apply filters locally
  useEffect(() => {
    let filtered = [...drugs];

    // Filter by stock status
    if (filters.stockStatus && filters.stockStatus !== 'all') {
      filtered = filtered.filter(drug => drug.stockStatus === filters.stockStatus);
    }

    setFilteredDrugs(filtered);
  }, [drugs, filters.stockStatus]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchDrugs();
  }, [fetchDrugs]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<DrugFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    fetchDrugs();
  }, [fetchDrugs]);

  // Get statistics from current data
  const stats = {
    total: drugs.length,
    inStock: drugs.filter(d => d.stockStatus === StockStatus.IN_STOCK).length,
    lowStock: drugs.filter(d => d.stockStatus === StockStatus.LOW_STOCK).length,
    outOfStock: drugs.filter(d => d.stockStatus === StockStatus.OUT_OF_STOCK).length,
  };

  return {
    drugs: filteredDrugs,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
    stats,
  };
}

/**
 * Hook để lấy chi tiết một drug (TODO: Backend chưa implement)
 */
export function useDrugDetail(drugId: number | null) {
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!drugId) {
      setDrug(null);
      return;
    }

    const fetchDrug = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await medicineService.getDrugById(drugId);
        setDrug(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải chi tiết thuốc';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDrug();
  }, [drugId]);

  return { drug, loading, error };
}
