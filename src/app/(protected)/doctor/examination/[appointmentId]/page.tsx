"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { AlertTriangle } from "lucide-react"

import { ExaminationLayout } from "../components/examination-layout"
import { PatientVerification } from "../components/patient-verification"
import { VitalSignsStep } from "../components/vital-signs-step"
import { ExaminationStep } from "../components/examination-step"
import { FollowUpStep } from "../components/follow-up-step"
import { SummaryStep } from "../components/summary-step"

import { appointmentService } from "@/services/appointment.service"
import { medicineService } from "@/services/medicine.service"

import ConfirmDialog from "@/components/ui/confirm-dialog"
import SuccessDialog from "@/components/ui/success-dialog"
import Loading from "@/components/ui/loading"

import type { RootState } from "@/redux"
import type { CreatePrescriptionRequest, PrescriptionItemInput, MedicationHistory } from "@/types/medicine"
import type { ExaminationData, PrescriptionItem } from "@/types/examination"
import type { CreateMedicalRecordPayload, CreateVitalSignPayload } from "@/types/examnation"
import type { AppointmentDetail } from "@/types/appointment/appointment.type"
import type { CreateLabTestOrderPayload } from "@/types/examnation/lab-test-dto"

export default function ExaminationPage() {
  const { appointmentId } = useParams()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)

  const [loading, setLoading] = useState(true)
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1)
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

  const handleNext = () => currentStep < 5 && setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4 | 5)
  const handlePrevious = () => currentStep > 1 && setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4 | 5)

  const handleUpdateData = (data: Partial<ExaminationData>) => {
    setExaminationData((prev) => ({ ...prev, ...data }))
  }

  const createMedicalRecord = async (prescriptionId?: string): Promise<string> => {
    if (!examinationData.diagnosis) throw new Error("Vui lòng nhập chẩn đoán trước khi hoàn tất khám bệnh")

    const payload: CreateMedicalRecordPayload = {
      appointmentId: appointmentId as string,
      diagnosis: examinationData.diagnosis,
      symptoms: examinationData.symptoms || "",
      doctorNotes: examinationData.additionalNotes || "",
      prescriptionId: prescriptionId,
    }

    const record = await appointmentService.createMedicalRecord(payload)
    return record.id
  }

  const createVitalSign = async (medicalRecordId: string) => {
    if (!examinationData.vitalSigns) return
    await appointmentService.createVitalSign({
      medicalRecordId,
      ...examinationData.vitalSigns,
    } as CreateVitalSignPayload)
  }

  const createFollowUpSuggestion = async (medicalRecordId: string) => {
    if (!examinationData.followUpSuggestion?.suggestedDate) return
    if (!user?.referenceId || !appointment) throw new Error("Thiếu thông tin bác sĩ hoặc cuộc hẹn")

    const payload = {
      medicalRecordId,
      doctorId: user.referenceId,
      patientId: appointment.patient.id,
      suggestedDate: examinationData.followUpSuggestion.suggestedDate,
      reason: examinationData.followUpSuggestion.reason || "",
    }
    await appointmentService.createFollowUpSuggestion(payload)
  }

  const createLabTestOrders = async (medicalRecordId: string) => {
    if (!examinationData.labTests?.length || !user?.referenceId) return
    
    console.log(`Creating ${examinationData.labTests.length} lab test orders with automatic payment...`)
    
    for (const labTest of examinationData.labTests) {
      const payload: CreateLabTestOrderPayload = {
        appointmentId: appointmentId as string,
        type: labTest.type,
        orderedBy: user.referenceId,
        labTestId: labTest.id, // Include labTestId for price lookup
      }
      
      try {
        // Use createWithPayment endpoint to automatically create payment
        const order = await appointmentService.createLabTestOrderWithPayment(payload)
        console.log(`✅ Lab test order created: ${order.id}, Payment: ${order.paymentId || 'PENDING'}`)
      } catch (error) {
        console.error(`❌ Failed to create lab test order for ${labTest.name}:`, error)
        // Continue with other lab tests even if one fails
      }
    }
  }

  const handleComplete = async () => {
    try {
      setLoading(true)
      
      // Step 1: Create Prescription in Medicine Service (if prescription items exist)
      let prescriptionId: string | undefined
      
      if (examinationData.prescriptionItems?.length && user?.referenceId && appointment) {
        console.log("Creating prescription with", examinationData.prescriptionItems.length, "items")
        
        const prescriptionPayload: CreatePrescriptionRequest = {
          patientId: appointment.patient.id,
          doctorId: user.referenceId,
          appointmentId: appointmentId as string,
          diagnosis: examinationData.diagnosis || "",
          notes: examinationData.additionalNotes || "",
          items: examinationData.prescriptionItems.map((item): PrescriptionItemInput => ({
            drugId: Number(item.drugId),
            dosage: item.dosage,
            frequency: item.dosage,
            route: "Uống",
            timing: item.instructions,
            durationDays: item.duration,
          }))
        }
        
        const prescriptionResponse = await medicineService.createPrescription(prescriptionPayload)
        prescriptionId = prescriptionResponse.prescriptionId
        console.log("✅ Prescription created:", prescriptionId)
      }
      
      // Step 2: Create Medical Record with prescriptionId
      const recordId = await createMedicalRecord(prescriptionId)
      console.log("✅ Medical record created:", recordId)
      
      // Step 3-5: Other steps
      await createVitalSign(recordId)
      await createLabTestOrders(recordId)
      await createFollowUpSuggestion(recordId)
      
      setConfirmOpen(false)
      setSuccessOpen(true)
    } catch (error) {
      console.error("❌ Lỗi hoàn tất khám:", error)
      alert("Có lỗi xảy ra khi hoàn tất khám bệnh. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPrescription = (history: MedicationHistory) => {
    // Convert MedicationHistory items (medicine.ts PrescriptionItem) to examination PrescriptionItem format
    const copiedItems: PrescriptionItem[] = history.items.map((item) => ({
      drugId: item.drugId.toString(), // Convert number to string
      drugName: item.drugName || "",
      activeIngredient: "", // Not available in history, will need to fetch if needed
      strength: "", // Not available in history
      dosage: item.dosage,
      instructions: [item.frequency, item.timing, item.route]
        .filter(Boolean)
        .join(", ") || item.instructions || "",
      duration: item.durationDays || 7,
      quantity: item.durationDays || 1, // Use duration as default quantity
      notes: item.notes,
    }))

    // Update examination data with copied prescription
    handleUpdateData({
      prescriptionItems: copiedItems,
      diagnosis: history.diagnosis, // Also copy diagnosis if available
    })

    // If not on step 3, navigate to it
    if (currentStep !== 3) {
      setCurrentStep(3)
    }

    console.log("✅ Copied prescription from", history.prescribedDate, "with", copiedItems.length, "items")
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
            data={examinationData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 4:
        return (
          <FollowUpStep
            data={examinationData.followUpSuggestion}
            onUpdate={(followUpSuggestion) => handleUpdateData({ followUpSuggestion })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 5:
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
      <ExaminationLayout 
        currentStep={currentStep} 
        onStepClick={setCurrentStep} 
        appointment={appointment}
        onCopyPrescription={handleCopyPrescription}
      >
        {renderStep()}
      </ExaminationLayout>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleComplete}
        title="Xác nhận kết thúc buổi khám"
        description="Bác sĩ có chắc chắn muốn kết thúc buổi khám và lưu thông tin bệnh án của bệnh nhân không?"
        icon={<AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.5} />}
        confirmText="Xác nhận và lưu"
        tone="warning"
      />

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
