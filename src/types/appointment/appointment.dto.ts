import { AppointmentType } from "./enums/appointment-type.enum";
import { AppointmentCategory } from "./enums/appointment-category.enum";

export interface CreateAppointmentPayload {
  doctorId: string;
  doctorName: string;
  roomNumber:string
  slotId: string;
  startAt: string; 
  endAt?: string;  
  patientId: string;
  patientName:string
  followUpId?: string;
  notes?: string;
  type?: AppointmentType;
  category?: AppointmentCategory;
}
