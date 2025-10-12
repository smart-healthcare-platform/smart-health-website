export interface PrescriptionSummary {
  id: string;
  patientName: string;
  doctorName: string;
  createdAt: string; // ISO 8601 date string
  status: 'PENDING_PAYMENT' | 'COMPLETED' | 'CANCELLED';
}

export interface PrescriptionItem {
  drugId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string; // e.g., "7 days"
  notes: string;
}

export interface PrescriptionDetail {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  patientInfo: {
    name: string;
    dateOfBirth: string;
  };
  doctorInfo: {
    name: string;
    specialty: string;
  };
  createdAt: string; // ISO 8601 date string
  status: 'PENDING_PAYMENT' | 'COMPLETED' | 'CANCELLED';
  items: PrescriptionItem[];
  notes: string;
}