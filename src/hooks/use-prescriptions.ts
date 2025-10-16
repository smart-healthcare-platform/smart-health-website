import { useState, useEffect, useCallback } from 'react';
import { medicineService } from '@/services/medicine.service';
import { 
  PrescriptionSummary, 
  PrescriptionDetail,
  PrescriptionFilters 
} from '@/types/medicine';
import { toast } from 'react-toastify';

/**
 * Hook để lấy danh sách prescriptions của một patient
 */
export function usePatientPrescriptions(patientId: string | null) {
  const [prescriptions, setPrescriptions] = useState<PrescriptionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescriptions = useCallback(async () => {
    if (!patientId) {
      setPrescriptions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await medicineService.getPrescriptionsByPatient(patientId);
      setPrescriptions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách đơn thuốc';
      setError(errorMessage);
      toast.error(errorMessage);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  return {
    prescriptions,
    loading,
    error,
    refresh: fetchPrescriptions,
  };
}

/**
 * Hook để lấy chi tiết một prescription
 */
export function usePrescriptionDetail(prescriptionId: string | null) {
  const [prescription, setPrescription] = useState<PrescriptionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescription = useCallback(async () => {
    if (!prescriptionId) {
      setPrescription(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await medicineService.getPrescriptionById(prescriptionId);
      setPrescription(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải chi tiết đơn thuốc';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [prescriptionId]);

  useEffect(() => {
    fetchPrescription();
  }, [fetchPrescription]);

  return {
    prescription,
    loading,
    error,
    refresh: fetchPrescription,
  };
}

/**
 * Hook để lấy tất cả prescriptions (Admin view)
 * TODO: Backend chưa implement pagination
 */
export function useAllPrescriptions(initialFilters?: PrescriptionFilters) {
  const [prescriptions, setPrescriptions] = useState<PrescriptionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PrescriptionFilters>(initialFilters || {});

  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Uncomment when backend implements this endpoint
      // const data = await medicineService.getAllPrescriptions(1, 100, filters);
      // setPrescriptions(data);
      
      // Temporary: Return empty array
      setPrescriptions([]);
      setError('API getAllPrescriptions chưa được triển khai từ backend');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách đơn thuốc';
      setError(errorMessage);
      toast.error(errorMessage);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const updateFilters = useCallback((newFilters: Partial<PrescriptionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    prescriptions,
    loading,
    error,
    filters,
    updateFilters,
    refresh: fetchPrescriptions,
  };
}
