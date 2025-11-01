import { apiAuth } from '@/lib/axios';
import { Appointment, AppointmentDetail, AppointmentResponse, CreateAppointmentPayload, MedicalRecord } from '@/types';
import { CreateFollowUpSuggestionPayload, CreateMedicalRecordPayload, CreateVitalSignPayload, FollowUpSuggestion, VitalSigns } from '@/types/examnation';


export const appointmentService = {
  // Tạo appointment mới
  async create(payload: CreateAppointmentPayload): Promise<Appointment> {
    const res = await apiAuth.post<{ success: boolean; message: string; data: Appointment }>("/appointments", payload)
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to create appointment")
    }
    return res.data.data
  },

  async getAll(): Promise<Appointment[]> {
    const res = await apiAuth.get<{ success: boolean; data: Appointment[] }>("/appointments")
    if (!res.data.success) return []
    return res.data.data
  },

  async getDetailsAppointmentForDoctor(id: string): Promise<AppointmentDetail> {
    const res = await apiAuth.get<{ success: boolean; data: AppointmentDetail }>(`/appointments/get-by-id/${id}`)
    if (!res.data.success) {
      throw new Error(`Appointment ${id} not found`)
    }
    return res.data.data
  },


  async getByPatientId(
    patientId: string,
    page = 1,
    limit = 3,
    search = "",
    status: 'confirmed' | 'completed' | 'cancelled' | 'all' = "all",
    dateRange: 'today' | 'week' | 'month' | 'year' | 'all' = "all",
  ): Promise<AppointmentResponse> {
    const res = await apiAuth.get<{ success: boolean; data: AppointmentResponse }>(
      `/appointments/patient/${patientId}`,
      { params: { page, limit, search, status, dateRange } }
    );
    if (!res.data.success) {
      throw new Error(`Appointment ${patientId} not found`);
    }
    return res.data.data;
  },

  async getByDoctorId(
    doctorId: string,
    start?: string,
    end?: string
  ): Promise<Appointment[]> {
    const res = await apiAuth.get<{ success: boolean; data: Appointment[] }>(
      `/appointments/doctor/${doctorId}`,
      { params: { start, end } }
    );
    if (!res.data.success) {
      throw new Error(`Appointments for doctor ${doctorId} not found`);
    }
    return res.data.data;
  },

  async getForDoctorByDateRange(doctorId: string, start: string, end: string): Promise<Appointment[]> {
    return this.getByDoctorId(doctorId, start, end);
  },

  async update(id: string, payload: Partial<CreateAppointmentPayload>): Promise<Appointment> {
    const res = await apiAuth.patch<{ success: boolean; data: Appointment }>(`/appointments/${id}`, payload)
    if (!res.data.success) {
      throw new Error(`Failed to update appointment ${id}`)
    }
    return res.data.data
  },

  async remove(id: string): Promise<void> {
    const res = await apiAuth.delete<{ success: boolean; message: string }>(`/appointments/${id}`)
    if (!res.data.success) {
      throw new Error(res.data.message || `Failed to delete appointment ${id}`)
    }
  },

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date()
    const start = today.toISOString().split("T")[0] + "T00:00:00Z"
    const end = today.toISOString().split("T")[0] + "T23:59:59Z"

    const res = await apiAuth.get<{ success: boolean; data: Appointment[] }>("/appointments", {
      params: { start, end },
    })
    if (!res.data.success) return []
    return res.data.data
  },


  // async getAllLabTests(): Promise<LabTest[]> {
  //   const res = await apiAuth.get<{ success: boolean; data: LabTest[] }>("/appointments/lab-tests")
  //   if (!res.data.success) return []
  //   return res.data.data
  // },

  async createMedicalRecord(payload: CreateMedicalRecordPayload): Promise<MedicalRecord> {
    const res = await apiAuth.post<{ success: boolean; message: string; data: MedicalRecord }>(
      "/appointments/medical-records",
      payload
    )

    if (!res.data.success) {
      throw new Error(res.data.message || "Không thể tạo hồ sơ khám bệnh")
    }

    return res.data.data
  },

  async createVitalSign(payload: CreateVitalSignPayload): Promise<VitalSigns> {
    const res = await apiAuth.post<{ success: boolean; message: string; data: VitalSigns }>(
      "/appointments/vital-signs",
      payload
    )

    if (!res.data.success) {
      throw new Error(res.data.message || "Không thể tạo hồ sơ khám bệnh")
    }

    return res.data.data
  },

  async createFollowUpSuggestion(payload: CreateFollowUpSuggestionPayload): Promise<FollowUpSuggestion> {
    const res = await apiAuth.post<{ success: boolean; message: string; data: FollowUpSuggestion }>(
      "/appointments/follow-up-suggestions",
      payload
    )
    console.log(res)
    if (!res.data.success) {
      throw new Error(res.data.message || "Không thể tạo đề xuất tái khám")
    }

    return res.data.data
  },

  async getPendingFollowUpByPatient(patientId: string): Promise<FollowUpSuggestion[]> {
    const res = await apiAuth.get<{ success: boolean; data: FollowUpSuggestion[] }>(
      `/appointments/follow-up-suggestions/patient/${patientId}/pending`
    );

    if (!res.data.success) {
      throw new Error(`Không thể lấy danh sách tái khám pending cho bệnh nhân ${patientId}`);
    }

    return res.data.data;
  },

  async getPreviousAppointment(appointmentId: string): Promise<AppointmentDetail | null> {
    const res = await apiAuth.get<{ success: boolean; data: AppointmentDetail | null }>(
      `/appointments/${appointmentId}/previous`
    )

    if (!res.data.success) {
      throw new Error(`Không thể lấy cuộc hẹn trước của appointment ${appointmentId}`)
    }

    return res.data.data
  },

}
