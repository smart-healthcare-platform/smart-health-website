import { VitalSignStatus } from "./enums/vital-sign-status.enum"

export interface CreateVitalSignPayload {
  medicalRecordId: string
  temperature?: number | null
  heartRate?: number | null
  systolicPressure?: number | null
  diastolicPressure?: number | null
  oxygenSaturation?: number | null
  height?: number | null
  weight?: number | null
  bmi?: number | null
  
  notes?: string | null
}
