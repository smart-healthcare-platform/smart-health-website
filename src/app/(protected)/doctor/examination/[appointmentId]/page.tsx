"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { ExaminationLayout } from "../components/examination-layout"
import { PatientVerification } from "../components/patient-verification"
import { VitalSignsStep } from "../components/vital-signs-step"
import { ExaminationStep } from "../components/examination-step"
import { SummaryStep } from "../components/summary-step"
import { appointmentService } from "@/services/appointment.service"
import { medicineService } from "@/services/medicine.service"
import SuccessDialog from "@/components/ui/success-dialog"
import ConfirmEndExaminationDialog from "@/components/ui/confirm-end-examition"
import { toast } from "react-toastify"

import type { CreateMedicalRecordPayload, CreateVitalSignPayload, ExaminationData, PrescriptionItem } from "@/types/examination"
import type { CreatePrescriptionRequest, PrescriptionItemInput } from "@/types/medicine"
import type { AppointmentDetailForDoctor } from "@/types/appointment"
import Loading from "@/components/ui/loading"

export default function ExaminationPage() {
  const { appointmentId } = useParams()
  const router = useRouter()
  const user = useSelector((state: any) => state.auth.user) // Get user at component level
  
  const [loading, setLoading] = useState(true)
  const [appointment, setAppointment] = useState<AppointmentDetailForDoctor | null>(null)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [examinationData, setExaminationData] = useState<ExaminationData>({ patientVerified: false })

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true)
        const data = await appointmentService.getDetailsAppointmentForDoctor(appointmentId as string)
        setAppointment(data)
      } catch (err) {
        console.error("Lỗi khi lấy thông tin appointment:", err)
      } finally {
        setLoading(false)
      }
    }

    if (appointmentId) fetchAppointment()
  }, [appointmentId])

  const handleNext = () => currentStep < 4 && setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4)
  const handlePrevious = () => currentStep > 1 && setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4)

  const handleUpdateData = (data: Partial<ExaminationData>) => {
    setExaminationData((prev) => ({ ...prev, ...data }))
  }

  /**
   * Format prescription items thành text để lưu vào medical record
   * Backward compatible với hệ thống hiện tại
   */
  const formatPrescriptionToText = (items?: PrescriptionItem[]): string => {
    if (!items || items.length === 0) return ""
    
    return items.map((item, index) => {
      const lines = [
        `${index + 1}. ${item.drugName}`,
        `   - Hoạt chất: ${item.activeIngredient} (${item.strength})`,
        `   - Liều lượng: ${item.dosage}`,
        `   - Số lượng: ${item.quantity}`,
        `   - Thời gian: ${item.duration} ngày`,
        `   - Hướng dẫn: ${item.instructions}`,
      ]
      
      if (item.notes) {
        lines.push(`   - Lưu ý: ${item.notes}`)
      }
      
      return lines.join('\n')
    }).join('\n\n')
  }

  const createMedicalRecord = async (): Promise<string> => {
    if (!examinationData.diagnosis) {
      throw new Error("Vui lòng nhập chẩn đoán trước khi hoàn tất khám bệnh")
    }

    const now = new Date()
    const localDateTime = now.toISOString().slice(0, 19).replace("T", " ")
    
    // Format prescription: prioritize prescriptionItems, fallback to legacy text
    const prescriptionText = examinationData.prescriptionItems && examinationData.prescriptionItems.length > 0
      ? formatPrescriptionToText(examinationData.prescriptionItems)
      : examinationData.prescription || ""
    
    const payload: CreateMedicalRecordPayload = {
      appointmentId: appointmentId as string,
      diagnosis: examinationData.diagnosis,
      symptoms: examinationData.symptoms || "",
      doctorNotes: examinationData.additionalNotes || "",
      prescription: prescriptionText,
      followUpDate: localDateTime,
    }

    const record = await appointmentService.createMedicalRecord(payload)
    return record.id
  }

  const createVitalSign = async (medicalRecordId: string) => {
    if (!examinationData.vitalSigns) return
    const v = examinationData.vitalSigns

    const payload: CreateVitalSignPayload = {
      medicalRecordId,
      temperature: v.temperature,
      heartRate: v.heartRate,
      systolicPressure: v.systolicPressure,
      diastolicPressure: v.diastolicPressure,
      oxygenSaturation: v.oxygenSaturation,
      height: v.height,
      weight: v.weight,
      bmi: v.bmi,
      notes: v.notes,
    }

    await appointmentService.createVitalSign(payload)
  }

  /**
   * Tạo prescription trong Medicine Service
   * @returns prescription ID nếu thành công, null nếu không có prescription items
   */
  const createPrescription = async (): Promise<string | null> => {
    // Nếu không có prescription items, skip
    if (!examinationData.prescriptionItems || examinationData.prescriptionItems.length === 0) {
      console.log("No prescription items to create")
      return null
    }

    // Validate user
    if (!user?.id) {
      throw new Error("Không tìm thấy thông tin bác sĩ")
    }

    if (!appointment) {
      throw new Error("Không tìm thấy thông tin cuộc hẹn")
    }

    // Map prescriptionItems sang PrescriptionItemInput
    const items: PrescriptionItemInput[] = examinationData.prescriptionItems.map(item => ({
      drugId: Number(item.drugId),      // Convert string → number
      dosage: item.dosage,
      frequency: item.instructions,     // Map instructions → frequency
      route: "oral",                    // Default: oral (TODO: add to UI)
      timing: "after_meal",             // Default: after_meal (TODO: add to UI)
      durationDays: item.duration,
    }))

    const request: CreatePrescriptionRequest = {
      patientId: appointment.patient.id,
      doctorId: user.id,
      appointmentId: appointmentId as string,
      diagnosis: examinationData.diagnosis || "",
      notes: examinationData.additionalNotes,
      items: items,
    }

    console.log("Creating prescription:", request)

    try {
      const response = await medicineService.createPrescription(request)
      console.log("Prescription created successfully:", response.id)
      toast.success("Đơn thuốc đã được lưu thành công")
      return response.id
    } catch (error) {
      console.error("Error creating prescription:", error)
      toast.error("Lỗi khi lưu đơn thuốc. Vui lòng thử lại.")
      throw error
    }
  }

  const handleComplete = async () => {
    try {
      // 1. Tạo Medical Record
      const recordId = await createMedicalRecord()
      
      // 2. Tạo Vital Signs
      if (examinationData.vitalSigns) {
        await createVitalSign(recordId)
      }

      // 3. Tạo Prescription (NEW!)
      if (examinationData.prescriptionItems && examinationData.prescriptionItems.length > 0) {
        await createPrescription()
      }

      setConfirmOpen(false)
      setSuccessOpen(true)
    } catch (error) {
      console.error("Lỗi hoàn tất khám:", error)
      toast.error("Có lỗi xảy ra khi hoàn tất khám bệnh")
    }
  }

  if (loading) return <Loading size="lg" />
  if (!appointment) return <p>Không tìm thấy thông tin cuộc hẹn</p>

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientVerification
            appointment={appointment}
            onNext={() => {
              handleUpdateData({ patientVerified: true })
              handleNext()
            }}
          />
        )
      case 2:
        return (
          <VitalSignsStep
            data={examinationData.vitalSigns}
            onUpdate={(vitalSigns) => handleUpdateData({ vitalSigns })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 3:
        return (
          <ExaminationStep
            data={{
              chiefComplaint: examinationData.chiefComplaint,
              symptoms: examinationData.symptoms,
              examination: examinationData.examination,
              diagnosis: examinationData.diagnosis,
              prescription: examinationData.prescription,
              labTests: examinationData.labTests,
            }}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 4:
        return (
          <SummaryStep
            appointment={appointment}
            examinationData={examinationData}
            onComplete={() => setConfirmOpen(true)} 
            onPrevious={handlePrevious}
          />
        )
    }
  }

  return (
    <>
      <ExaminationLayout currentStep={currentStep} onStepClick={setCurrentStep}>
        {renderStep()}
      </ExaminationLayout>

      {/* 🔹 Dialog xác nhận */}
      <ConfirmEndExaminationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleComplete}
      />

      {/* 🔹 Modal thông báo thành công */}
      <SuccessDialog
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false)
          router.push("/doctor")
        }}
        title="Kết thúc khám thành công!"
        message="Thông tin bệnh án và sinh hiệu của bệnh nhân đã được lưu lại thành công."
        confirmText="Quay lại danh sách"
        onConfirm={() => {
          setSuccessOpen(false)
          router.push("/doctor")
        }}
      />
    </>
  )
}
