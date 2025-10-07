import { apiAuth} from '@/lib/axios';

export const patientService = {
    getByUserId: async (userId: string, token?: string) => {
        return apiAuth.get(`/patients/user/${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }).then(res => res.data);
    }
}
