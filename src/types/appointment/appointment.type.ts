import { MedicalRecord } from "../examnation/medical-records.type";
import { AppointmentType } from "./enums/appointment-type.enum";
import { AppointmentCategory } from "./enums/appointment-category.enum";
import { AppointmentStatus } from "./enums/appointment-status.enum";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  slotId: string;
  status: AppointmentStatus;
  type: AppointmentType;
  notes: string;
  createdAt: string;
  updatedAt: string;
  startAt: string;
  followUpId?:string
}

export interface AppointmentDetail extends Appointment {
  patient: {
    id: string;
    fullName: string;
    gender: "male" | "female" | "other";
    dateOfBirth: string;
    address: string;
  };
  medicalRecord?: MedicalRecord;
}

export interface AppointmentFilters {
  dateRange: {
    start: string;
    end: string;
  };
  status?: AppointmentStatus[];
  type?: AppointmentType[];
  doctorId?: string;
  department?: string;
}

export type ViewMode = "table" | "calendar";
