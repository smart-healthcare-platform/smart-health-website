import { MedicalRecord } from "../examnation/medical-records.type";
import { LabTestOrder } from "../examnation/lab-test.type";
import { AppointmentType } from "./enums/appointment-type.enum";
import { AppointmentStatus } from "./enums/appointment-status.enum";
import { Gender } from "../patient/enums/patient-gender.enum.dto";

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
  endAt: string;
  followUpId?: string;
  paymentStatus?: "UNPAID" | "PENDING" | "PAID" | "REFUNDED"
  paymentId?: string | null
  paidAmount?: number | null
  paidAt?: string | null
  checkedInAt?: string | null
  consultationFee?: number
  prescriptionId?: string | null
  labTestOrders?: LabTestOrder[]
}

export interface AppointmentDetail extends Appointment {
  patient: {
    id: string;
    fullName: string;
    gender: Gender;
    dateOfBirth: string;
    address: string;
    phone: string
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
