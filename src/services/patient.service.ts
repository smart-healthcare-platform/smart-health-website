import { api } from '@/lib/axios';

export const patientService = {
    getByUserId: async (userId: string, token?: string) => {
        return api.get(`/patients/user/${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }).then(res => res.data);
    }
}
