import { VitalSigns } from "./vital-sign.type"
import { FollowUpSuggestion } from "./follow-up-suggestion.type"

export interface MedicalRecord {
  id: string
  appointmentId: string
  diagnosis: string
  symptoms?: string
  doctorNotes?: string
  prescription?: string
  createdAt: string
  updatedAt: string

  vitalSigns?: VitalSigns
  followUpSuggestions?: FollowUpSuggestion[]
}
