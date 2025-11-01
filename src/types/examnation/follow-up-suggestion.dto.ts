export interface CreateFollowUpSuggestionPayload {
  medicalRecordId: string
  doctorId: string
  patientId: string
  suggestedDate?: string
  reason?: string
}