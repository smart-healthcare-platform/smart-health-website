import { AppointmentDetailForDoctor } from "./appointment"

export interface VitalSigns {
  systolicPressure?: number        // Huyết áp tâm thu (mmHg)
  diastolicPressure?: number       // Huyết áp tâm trương (mmHg)
  heartRate?: number               // Nhịp tim (bpm)
  temperature?: number             // Nhiệt độ (°C)
  weight?: number                  // Cân nặng (kg)
  height?: number                  // Chiều cao (cm)
  bmi?: number                     // Chỉ số BMI (kg/m²)
  respiratoryRate?: number         // Nhịp thở (lần/phút)
  oxygenSaturation?: number        // SpO₂ (%)
  notes?: string                   // Ghi chú
}

export enum VitalSignStatus {
  WAITING_FOR_TEST_RESULT = "waiting_for_test_result",
  COMPLETED = "completed",
}

export interface CreateVitalSignPayload {
  medicalRecordId: string

  // --- Chỉ số cơ bản ---
  temperature?: number        // °C
  heartRate?: number          // bpm
  systolicPressure?: number   // mmHg
  diastolicPressure?: number  // mmHg
  oxygenSaturation?: number   // SpO₂ %
  height?: number             // cm
  weight?: number             // kg
  bmi?: number                // kg/m²

  // --- Chỉ số xét nghiệm ---
  bloodSugar?: number         // mg/dL
  cholesterolTotal?: number   // mg/dL
  hdl?: number                // mg/dL
  ldl?: number                // mg/dL
  triglycerides?: number      // mg/dL
  creatinine?: number         // mg/dL

  // --- Trạng thái & ghi chú ---
  status?: VitalSignStatus
  notes?: string
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
  
  // Legacy prescription (text) - giữ lại để backward compatible
  prescription?: string

  // NEW: Structured prescription items
  prescriptionItems?: PrescriptionItem[]

  /**
   * Danh sách xét nghiệm được chọn
   * Mỗi phần tử gồm id, tên và giá của xét nghiệm
   */
  labTests?: {
    id: string
    name: string
    price: number
  }[]

  // Step 4: Summary
  followUpDate?: string
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

export type ExaminationStep = 1 | 2 | 3 | 4

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
  
  // Legacy prescription field
  prescription?: string
  
  // NEW: Structured prescription items
  prescriptionItems?: PrescriptionItem[]

  /**
   * Danh sách ID các xét nghiệm (nhiều lựa chọn)
   */
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

export interface SummaryStepProps {
  appointment: AppointmentDetailForDoctor
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
}