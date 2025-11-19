import { apiAuth } from '@/lib/axios'
import { Patient } from '@/types/patient/patient.type'
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
    }


}
