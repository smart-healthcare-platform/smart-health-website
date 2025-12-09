import { apiAuth } from '@/lib/axios'
import { Patient, UpdatePatientDto } from '@/types/patient/patient.type'
import { ApiResponse, PaginatedResponse } from '@/types/response'

export const patientService = {
    async getAllPatients(
        page = 1,
        limit = 5,
        search = ''
    ): Promise<PaginatedResponse<Patient>> {
        const res = await apiAuth.get<ApiResponse<PaginatedResponse<Patient>>>('/patients', {
            params: { page, limit, search },
        });

        if (!res.data.success) {
            return { data: [], total: 0, page, limit };
        }

        return res.data.data;
    },

    async getStats(): Promise<{
        totalPatients: { value: number; change: number };
        newThisMonth: { value: number; change: number };
        averageAge: { value: number; change: number };
    }> {
        const res = await apiAuth.get('/patients/stats');

        if (!res.data.success) {
            return {
                totalPatients: { value: 0, change: 0 },
                newThisMonth: { value: 0, change: 0 },
                averageAge: { value: 0, change: 0 },
            };
        }

        const { totalPatients, newThisMonth, averageAge } = res.data.data;

        return {
            totalPatients: { value: totalPatients.value, change: totalPatients.change },
            newThisMonth: { value: newThisMonth.value, change: newThisMonth.change },
            averageAge: { value: Math.round(averageAge.value), change: averageAge.change },
        };
    },

    async updatePatient(id: string, data: UpdatePatientDto): Promise<Patient | null> {
        try {
            const res = await apiAuth.put<ApiResponse<Patient>>(`/patients/${id}`, data);

            if (!res.data.success) {
                return null;
            }

            return res.data.data;
        } catch (error) {
            console.error("Failed to update patient", error);
            return null;
        }
    }


}
