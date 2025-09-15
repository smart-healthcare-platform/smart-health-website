import api from '@/lib/axios'
import { Appointment, CreateAppointmentPayload } from '@/types';

export const appointmentService = {
    // Tạo appointment mới
    async create(payload: CreateAppointmentPayload): Promise<Appointment> {
      const res = await api.post<{ success: boolean; message: string; data: Appointment }>("/appointments", payload)
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create appointment")
      }
      return res.data.data
    },
  
    // Lấy tất cả appointment
    async getAll(): Promise<Appointment[]> {
      const res = await api.get<{ success: boolean; data: Appointment[] }>("/appointments")
      if (!res.data.success) return []
      return res.data.data
    },
  
    // Lấy chi tiết appointment theo id
    async getById(id: string): Promise<Appointment> {
      const res = await api.get<{ success: boolean; data: Appointment }>(`/appointments/${id}`)
      if (!res.data.success) {
        throw new Error(`Appointment ${id} not found`)
      }
      return res.data.data
    },
  
    // Cập nhật appointment
    // async update(id: string, payload: Partial<CreateAppointmentPayload>): Promise<Appointment> {
    //   const res = await api.patch<{ success: boolean; data: Appointment }>(`/appointments/${id}`, payload)
    //   if (!res.data.success) {
    //     throw new Error(res.data.message || `Failed to update appointment ${id}`)
    //   }
    //   return res.data.data
    // },
  
    // Xóa appointment
    async remove(id: string): Promise<void> {
      const res = await api.delete<{ success: boolean; message: string }>(`/appointments/${id}`)
      if (!res.data.success) {
        throw new Error(res.data.message || `Failed to delete appointment ${id}`)
      }
    },
  }