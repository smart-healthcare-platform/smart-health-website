export interface FollowUpSuggestion {
    id: string
    originalAppointmentId: string
    doctorId: string
    patientId: string
    suggestedDate?: string
    reason?: string
    createdAt: string
    updatedAt: string
  }