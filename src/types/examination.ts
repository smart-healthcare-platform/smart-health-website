import { AppointmentDetail } from "./appointment"

export interface VitalSigns {
  id?: string
  medicalRecordId?: string
  systolicPressure?: number | null       // Huyết áp tâm thu (mmHg)
  diastolicPressure?: number | null      // Huyết áp tâm trương (mmHg)
  heartRate?: number | null              // Nhịp tim (bpm)
  temperature?: number | null            // Nhiệt độ (°C)
  weight?: number | null                 // Cân nặng (kg)
  height?: number | null                 // Chiều cao (cm)
  bmi?: number | null                    // Chỉ số BMI (kg/m²)
  respiratoryRate?: number | null        // Nhịp thở (lần/phút)
  oxygenSaturation?: number | null       // SpO₂ (%)
  bloodSugar?: number | null             // Đường huyết (mg/dL)
  cholesterolTotal?: number | null       // Cholesterol tổng (mg/dL)
  hdl?: number | null                    // HDL (mg/dL)
  ldl?: number | null                    // LDL (mg/dL)
  triglycerides?: number | null          // Triglyceride (mg/dL)
  creatinine?: number | null             // Creatinine (mg/dL)
  status?: string | null                 // Trạng thái (VD: waiting_for_test_result)
  notes?: string | null                  // Ghi chú
  createdAt?: string
  updatedAt?: string
}

export enum VitalSignStatus {
  WAITING_FOR_TEST_RESULT = "waiting_for_test_result",
  COMPLETED = "completed",
}

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

  bloodSugar?: number | null
  cholesterolTotal?: number | null
  hdl?: number | null
  ldl?: number | null
  triglycerides?: number | null
  creatinine?: number | null

  status?: VitalSignStatus
  notes?: string | null
}




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

export interface CreateMedicalRecordPayload {
  appointmentId: string
  diagnosis: string
  symptoms?: string
  doctorNotes?: string
  prescription?: string
  followUpDate?: string
}

export interface MedicalRecord {
  id: string
  appointmentId: string
  diagnosis: string
  symptoms?: string
  diagnosisCode?: string
  doctorNotes?: string
  prescription?: string
  followUpDate?: string
  createdAt: string
  updatedAt: string

  vitalSigns?: VitalSigns
}

export interface CreateFollowUpSuggestionPayload {
  originalAppointmentId: string
  doctorId: string
  patientId: string
  suggestedDate?: string
  reason?: string
}

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