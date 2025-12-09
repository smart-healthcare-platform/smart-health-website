export interface CreateMedicalRecordPayload {
    appointmentId: string;
    diagnosis: string;
    symptoms?: string;
    doctorNotes?: string;
    /** @deprecated Use prescriptionId instead */
    prescription?: string;
    /** Reference to prescription in Medicine Service */
    prescriptionId?: string;
  }
  