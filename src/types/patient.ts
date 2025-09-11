export interface Patient {
  id: string
  // Personal Information
  firstName: string
  lastName: string
  fullName: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  phone: string
  email?: string
  address: {
    street: string
    ward: string
    district: string
    city: string
  }

  // Medical Information
  bloodType?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  allergies: string[]
  chronicConditions: string[]
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }

  // Insurance & Administrative
  insuranceNumber?: string
  insuranceProvider?: string
  patientId: string // Hospital patient ID

  // System fields
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface MedicalRecord {
  id: string
  patientId: string
  visitDate: string
  visitType: "consultation" | "follow-up" | "emergency" | "surgery" | "checkup"

  // Visit Details
  chiefComplaint: string
  symptoms: string[]
  vitalSigns: {
    temperature?: number
    bloodPressure?: {
      systolic: number
      diastolic: number
    }
    heartRate?: number
    respiratoryRate?: number
    weight?: number
    height?: number
  }

  // Medical Assessment
  diagnosis: {
    primary: string
    secondary?: string[]
    icd10Code?: string
  }

  // Treatment
  treatmentPlan: string
  medications: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }[]

  // Follow-up
  followUpDate?: string
  followUpInstructions?: string

  // Provider Information
  doctorId: string
  doctorName: string
  department: string

  // System fields
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  id: string
  patientId: string
  patient: Patient

  // Scheduling
  date: string
  startTime: string
  endTime: string
  duration: number // in minutes

  // Appointment Details
  type: "consultation" | "follow-up" | "checkup" | "surgery" | "emergency"
  reason: string
  notes?: string
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show"

  // Provider & Location
  doctorId: string
  doctorName: string
  department: string
  roomNumber?: string

  // Integration
  googleEventId?: string
  googleCalendarId?: string

  // System fields
  createdAt: string
  updatedAt: string
}

export type ViewMode = "table" | "calendar"

export interface AppointmentFilters {
  dateRange: {
    start: string
    end: string
  }
  status?: Appointment["status"][]
  type?: Appointment["type"][]
  doctorId?: string
  department?: string
}
