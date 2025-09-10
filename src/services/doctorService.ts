import api from '@/lib/axios';
import { TimeSlot, TimeSlotStatus } from '@/types/timeSlot';
import { Doctor, DoctorDetail, PaginatedResponse } from '@/types';

export const doctorService = {
  async getPublicDoctors(page = 1, limit = 6, search = '') {
    console.log('doctorService.getPublicDoctors called with', { page, limit, search });
    const res = await api.get<{ data: PaginatedResponse<Doctor> }>('/public/doctors', {
      params: { page, limit, search }
    });
    return res.data.data;
  },

  async getDoctorById(id: string): Promise<DoctorDetail> {
    const res = await api.get<{ data: DoctorDetail }>(`/public/doctors/${id}`);
    return res.data.data;
  },

  // <-- Mới thêm
  async getDoctorSlots(doctorId: string) {
    try {
      const res = await api.get<{ success: boolean; data: any[] }>('/public/doctor-slots', {
        params: { doctor_id: doctorId }
      });

      if (!res.data.success) return [];

      const slots: TimeSlot[] = res.data.data.map(slot => ({
        time: new Date(slot.start_time).toLocaleTimeString('vi-VN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: mapStatus(slot.status),
      }));

      return slots;
    } catch (err) {
      console.error('Error fetching doctor slots:', err);
      return [];
    }
  },
};

// helper map status API -> TimeSlotStatus
function mapStatus(status: string): TimeSlotStatus {
  switch (status) {
    case 'available':
      return 'available';
    case 'booked':
      return 'booked';
    case 'off':
      return 'off';
    case 'expired':
      return 'expired';
    default:
      return 'expired'; // fallback
  }
}
