import { apiAuth, apiNoAuth } from "@/lib/axios"
import { TimeSlot, TimeSlotStatus } from "@/types/timeSlot"
import { Doctor, DoctorCertificate, DoctorDetail, WeeklyAvailability } from "@/types/doctor/doctor.type"
import { PaginatedResponse } from "@/types/response"
import { ApiResponse } from "./admin.service"
import { CreateDoctorDto } from "@/types/doctor/dto/create-doctor.dto"
import { CreateDoctorCertificateDto } from "@/types/doctor/dto/create-certificate.dto"
import { WeeklyAvailabilityDto } from "@/types/doctor/dto/create-weekly.dto"

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

  },
  async createDoctor(doctorData: CreateDoctorDto): Promise<Doctor | null> {
    try {
      const res = await apiAuth.post<{ success: boolean; data: Doctor }>('/doctors', doctorData);

      if (!res.data.success) {
        console.error("Failed to create doctor");
        return null;
      }

      return res.data.data;
    } catch (error) {
      console.error("Error creating doctor:", error);
      return null;
    }
  },

  async createCertificate(
    payload: CreateDoctorCertificateDto
  ): Promise<DoctorCertificate | null> {
    try {
      const res = await apiAuth.post<ApiResponse<DoctorCertificate>>(
        "/doctors/certificates",
        payload
      )

      if (!res.data.success) {
        console.error("Create certificate failed")
        return null
      }

      return res.data.data
    } catch (error) {
      console.error("Error creating certificate:", error)
      return null
    }
  },

  async createOrUpdateWeeklyAvailability(
    doctorId: string,
    weekly: WeeklyAvailabilityDto[]
  ) {
    try {
      const res = await apiAuth.post<ApiResponse<WeeklyAvailability>>(
        `/doctors/${doctorId}/weekly`,
        { weekly }
      );

      if (!res.data.success) {
        console.error("Failed to update weekly availability");
        return null;
      }

      return res.data.data;
    } catch (error) {
      console.error("Error updating weekly availability:", error);
      return null;
    }
  },

  async getWeeklySchedule(doctorId: string) {
    try {
      const res = await apiAuth.get<ApiResponse<any[]>>(
        `/doctors/${doctorId}/weekly`
      );

      if (!res.data.success) {
        console.error("Failed to fetch weekly schedule");
        return [];
      }

      return res.data.data;
    } catch (error) {
      console.error("Error fetching weekly schedule:", error);
      return [];
    }
  },

  async getStats(): Promise<{
    totalDoctors: { value: number; change: number };
    newThisMonth: { value: number; change: number };
    averageAge: { value: number; change: number };
  }> {
    const res = await apiAuth.get('/doctors/stats');

    if (!res.data.success) {
      return {
        totalDoctors: { value: 0, change: 0 },
        newThisMonth: { value: 0, change: 0 },
        averageAge: { value: 0, change: 0 },
      };
    }

    const { totalDoctors, newThisMonth, averageAge } = res.data.data;

    return {
      totalDoctors: {
        value: totalDoctors.value,
        change: totalDoctors.change,
      },
      newThisMonth: {
        value: newThisMonth.value,
        change: newThisMonth.change,
      },
      averageAge: {
        value: Math.round(averageAge.value),
        change: averageAge.change,
      },
    };
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
