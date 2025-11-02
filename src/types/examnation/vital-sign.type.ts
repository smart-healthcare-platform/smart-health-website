import { VitalSignStatus } from "./enums/vital-sign-status.enum";

export interface VitalSigns {
  id?: string
  medicalRecordId?: string

  temperature?: number | null
  heartRate?: number | null
  systolicPressure?: number | null
  diastolicPressure?: number | null
  oxygenSaturation?: number | null
  height?: number | null
  weight?: number | null
  bmi?: number | null

  bloodSugar?: number | null
  cholesterolTotal?: number | null
  hdl?: number | null
  ldl?: number | null
  triglycerides?: number | null
  creatinine?: number | null

  status?: VitalSignStatus | null
  notes?: string | null

  createdAt?: string
  updatedAt?: string
}
