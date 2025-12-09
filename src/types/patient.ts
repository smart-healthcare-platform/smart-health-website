import { AppointmentCategory } from "@/types/appointment/enums/appointment-category.enum"
import { AppointmentType } from "@/types/appointment/enums/appointment-type.enum"



export interface PatientFormData {
  fullName: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
  address: string;
  notes:string
  type: AppointmentType,
  category: AppointmentCategory
  followUpId?: string
}