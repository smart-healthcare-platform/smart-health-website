import { apiNoAuth } from "@/lib/axios"
import { TimeSlot, TimeSlotStatus } from "@/types/timeSlot"
import { Doctor, DoctorDetail } from "@/types/doctor/doctor.type"
import { PaginatedResponse } from "@/types/response"
import { ApiResponse } from "./admin.service"

export const doctorService = {
  async getAllDoctors(
    page = 1,
    limit = 5,
    search = ''
  ): Promise<PaginatedResponse<Doctor>> {
    try {
      const res = await apiNoAuth.get<ApiResponse<PaginatedResponse<Doctor>>>('/public/doctors', {
        params: { page, limit, search },
      });

      if (!res.data.success) {
        return { data: [], total: 0, page, limit };
      }

      return res.data.data;
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      return { data: [], total: 0, page, limit };
    }
  },


  async getDoctorById(id: string): Promise<DoctorDetail> {
    const res = await apiNoAuth.get<{ data: DoctorDetail }>(`/public/doctors/${id}`)
    return res.data.data
  },

  async getDoctorSlots(doctorId: string): Promise<TimeSlot[]> {
    try {
      const res = await apiNoAuth.get<{ success: boolean; data: any[] }>(
        `/public/doctors/appointment-slots/${doctorId}`
      );

      if (!res.data.success) return [];

      const slots: TimeSlot[] = res.data.data.map((s) => {
        const [date, time] = s.start_time.split(" ");

        return {
          id: s.id,
          startTime: s.start_time,
          date,
          time: time.slice(0, 5),
          status: mapStatus(s.status),
        };
      });

      return slots;
    } catch (err) {
      console.error("Error fetching doctor slots:", err);
      return [];
    }

  }
}

// map API status -> TimeSlotStatus
function mapStatus(status: string): TimeSlotStatus {
  switch (status) {
    case "available": return "available"
    case "booked": return "booked"
    case "off": return "off"
    case "expired": return "expired"
    default: return "expired"
  }
}
