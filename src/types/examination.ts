
import { AppointmentDetail } from "@/types/appointment/appointment.type"
import { VitalSigns } from "./examnation/vital-sign.type"
import { LabTestType } from "./examnation/enums/lab-test-type.enum"

/**
 * Prescription Item - Thông tin thuốc trong đơn
 */
export interface PrescriptionItem {
  drugId: string              // ID từ Medicine Service
  drugName: string            // Tên thuốc
  activeIngredient: string    // Hoạt chất
  strength: string            // Hàm lượng (VD: "500mg")
  quantity: number            // Số lượng (viên/vỉ/hộp)
  dosage: string              // Liều lượng (VD: "1 viên x 2 lần/ngày")
  duration: number            // Số ngày dùng
  instructions: string        // Hướng dẫn sử dụng (VD: "Uống sau ăn 30 phút")
  notes?: string              // Ghi chú thêm
}

export interface ExaminationData {
  // Step 1: Patient verification
  patientVerified: boolean

  // Step 2: Vital signs
  vitalSigns?: VitalSigns

  // Step 3: Examination details
  chiefComplaint?: string
  symptoms?: string
  examination?: string
  diagnosis?: string
  followUpDate?: string | Date
  // Legacy prescription (text) - giữ lại để backward compatible
  prescription?: string

  // NEW: Structured prescription items
  prescriptionItems?: PrescriptionItem[]
  labTests?: {
    id: string
    name: string
    price: number
    type: LabTestType
  }[]

  // Step 4: Follow-up suggestion
  followUpSuggestion?: {
    suggestedDate?: string
    reason?: string
  }

  // Step 5: Summary
  additionalNotes?: string
}


export interface ExaminationRecord {
  id: string
  appointmentId: string
  patientId: string
  doctorId: string
  startTime: string
  endTime?: string
  data: ExaminationData
  status: "in-progress" | "completed"
}

export type ExaminationStep = 1 | 2 | 3 | 4 | 5

export interface PatientVerificationData {
  patientName: string
  dateOfBirth: string
  gender: string
  phone: string
  address: string
  bloodType?: string
  allergies?: string
  chronicDiseases?: string
  reason?: string
}

export interface VitalSignsStepProps {
  data?: VitalSigns
  onUpdate: (data: VitalSigns) => void
  onNext: () => void
  onPrevious: () => void
}

export interface ExaminationStepData {
  chiefComplaint?: string
  symptoms?: string
  examination?: string
  diagnosis?: string

  prescription?: string
  followUpDate?: Date | string
  prescriptionItems?: PrescriptionItem[]
  labTests?: {
    id: string
    name: string
    price: number
    type: LabTestType
  }[]
}

export interface ExaminationStepProps {
  data: ExaminationStepData
  onUpdate: (data: Partial<ExaminationStepData>) => void
  onNext: () => void
  onPrevious: () => void
}

export interface FollowUpStepProps {
  data?: {
    suggestedDate?: string
    reason?: string
  }
  onUpdate: (data: { suggestedDate?: string; reason?: string }) => void
  onNext: () => void
  onPrevious: () => void
}

export interface SummaryStepProps {
  appointment: AppointmentDetail
  examinationData: ExaminationData
  onComplete: () => void
  onPrevious: () => void
}



