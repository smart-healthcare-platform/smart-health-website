"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ExaminationLayout } from "../components/examination-layout"
import { PatientVerification } from "../components/patient-verification"
import { VitalSignsStep } from "../components/vital-signs-step"
import { ExaminationStep } from "../components/examination-step"
import { SummaryStep } from "../components/summary-step"
import { appointmentService } from "@/services/appointment.service"
import SuccessDialog from "@/components/ui/success-dialog"
import ConfirmEndExaminationDialog from "@/components/ui/confirm-end-examition"

import type { CreateMedicalRecordPayload, CreateVitalSignPayload, ExaminationData, PrescriptionItem } from "@/types/examination"
import type { AppointmentDetailForDoctor } from "@/types/appointment"
import Loading from "@/components/ui/loading"

export default function ExaminationPage() {
  const { appointmentId } = useParams()
  const router = useRouter()
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

    const vital = await appointmentService.createVitalSign(payload)
  }

  const handleComplete = async () => {
    try {
      const recordId = await createMedicalRecord()
      if (examinationData.vitalSigns) {
        await createVitalSign(recordId)
      }

      setConfirmOpen(false)
      setSuccessOpen(true)
    } catch (error: any) {
      console.error("Lỗi hoàn tất khám:", error)
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
