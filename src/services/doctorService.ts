import api from '@/lib/axios'
import { Doctor, DoctorDetail } from '@/types';
export const doctorService = {
  async getPublicDoctors() {
    const res = await api.get<{ data: Doctor[] }>("/public/doctors");
    return res.data.data;
  },

  async getDoctorById(id: string): Promise<DoctorDetail> {
    const res = await api.get<{ data: DoctorDetail }>(`/public/doctors/${id}`);
    return res.data.data;
  },
};