import { apiAuth } from '@/lib/axios'
import { PrescriptionSummary, PrescriptionDetail } from '@/types/medicine';

export const medicineService = {
  /**
   * Fetches a list of prescriptions for a specific patient.
   * @param patientId The ID of the patient.
   * @returns A promise that resolves to the list of prescriptions.
   */
  getPrescriptionsByPatient: async (patientId: string): Promise<PrescriptionSummary[]> => {
    const response = await apiAuth.get(`/medicine/api/v1/patients/${patientId}/prescriptions`);
    return response.data.data;
  },

  /**
   * Fetches the detailed information for a single prescription.
   * @param prescriptionId The ID of the prescription.
   * @returns A promise that resolves to the prescription details.
   */
  getPrescriptionById: async (prescriptionId: string): Promise<PrescriptionDetail> => {
    const response = await apiAuth.get(`/medicine/api/v1/prescriptions/${prescriptionId}`);
    return response.data.data;
  },
};