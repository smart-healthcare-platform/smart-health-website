import { apiAuth } from '@/lib/axios'
import { Patient } from '@/types/patient/patient.type'
import { PatientListResponse } from '@/types/patient/patient.response'
import { ApiResponse } from '@/types/response'

export const patientService = {
    async getAll(page = 1, limit = 5, search = ""): Promise<PatientListResponse> {
        const res = await apiAuth.get<ApiResponse<PatientListResponse>>('/patients', {
            params: { page, limit, search }
        })

        if (!res.data.success) {
            return { data: [], total: 0, page, limit }
        }

        return res.data.data
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
