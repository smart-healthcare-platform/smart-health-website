"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ExaminationLayout } from "../components/examination-layout"
import { PatientVerification } from "../components/patient-verification"
import { VitalSignsStep } from "../components/vital-signs-step"
import { ExaminationStep } from "../components/examination-step"
import { SummaryStep } from "../components/summary-step"
import type { ExaminationData } from "@/types/examination"

// Mock data - thay bằng API call thực tế
const mockAppointment = {
  id: "1",
  patientName: "Nguyễn Văn A",
  patientId: "p1",
  dateOfBirth: "1985-05-15",
  gender: "Nam",
  phone: "0901234567",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  bloodType: "O+",
  allergies: "Penicillin",
  chronicDiseases: "Cao huyết áp",
  appointmentTime: new Date().toISOString(),
  reason: "Đau đầu, chóng mặt kéo dài 3 ngày",
}

export default function ExaminationPage() {
  const params = useParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [examinationData, setExaminationData] = useState<ExaminationData>({
    patientVerified: false,
  })

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4)
    }
  }

  const handleUpdateData = (data: Partial<ExaminationData>) => {
    setExaminationData((prev) => ({ ...prev, ...data }))
  }

  const handleComplete = async () => {
    console.log("[v0] Hoàn thành khám bệnh:", examinationData)
    // TODO: Gọi API lưu dữ liệu khám
    router.push("/appointments")
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientVerification
            appointment={mockAppointment}
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
            appointment={mockAppointment}
            examinationData={examinationData}
            onComplete={handleComplete}
            onPrevious={handlePrevious}
          />
        )
    }
  }

  return (
    <ExaminationLayout currentStep={currentStep} onStepClick={setCurrentStep}>
      {renderStep()}
    </ExaminationLayout>
  )
}
