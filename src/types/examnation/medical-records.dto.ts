export interface CreateMedicalRecordPayload {
    appointmentId: string;
    diagnosis: string;
    symptoms?: string;
    doctorNotes?: string;
    prescription?: string;
  }
  