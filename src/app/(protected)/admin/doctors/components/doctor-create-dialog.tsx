"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Step1BasicInfo from "./add-doctor-step-1"
import Step2Certificates from "./add-doctor-step-2"
import Step3Schedule from "./add-doctor-step-3"
import Step4Review from "./add-doctor-step-4"
import { DoctorFormInput } from "@/types/doctor/doctor-form-input"
import { Gender } from "@/types/patient/enums/patient-gender.enum.dto"
import { doctorService } from "@/services/doctor.service"
import { CreateDoctorDto } from "@/types/doctor/dto/create-doctor.dto"
import { CreateDoctorCertificateDto } from "@/types/doctor/dto/create-certificate.dto"
import { CertificateType } from "@/types/doctor/enums/doctor-certificate.type"
import SuccessDialog from "@/components/ui/success-dialog"
import ErrorDialog from "@/components/ui/error-dialog"

interface AddDoctorDialogProps {
  isOpen?: boolean
  onClose?: () => void
  onSave?: () => void
  onAdded?: () => void
}

const steps = [
  { id: 1, title: "Thông tin cơ bản", icon: Check },
  { id: 2, title: "Chứng chỉ", icon: Check },
  { id: 3, title: "Lịch làm việc", icon: Check },
  { id: 4, title: "Xác nhận", icon: Check },
]

export default function AddDoctorDialog({ isOpen, onClose, onSave, onAdded }: AddDoctorDialogProps) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<DoctorFormInput>({
    full_name: "",
    email: "",
    gender: Gender.MALE,
    date_of_birth: "",
    phone: "",
    avatar: "",
    bio: "",
    experience_years: 0,
    certificates: [],
    weeklyAvailability: []
  })
  const [isStep1Valid, setIsStep1Valid] = useState(false)

  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleClose = () => {
    setOpen(false)
    setCurrentStep(1)
    setFormData({
      full_name: "",
      email: "",
      gender: Gender.MALE,
      date_of_birth: "",
      phone: "",
      avatar: "",
      bio: "",
      experience_years: 0,
      certificates: [],
      weeklyAvailability: []
    })
    onClose?.()
  }

  const prepareCertificatePayload = (cert: typeof formData.certificates[0], doctorId: string): CreateDoctorCertificateDto => {
    const base: CreateDoctorCertificateDto = {
      doctor_id: doctorId,
      type: cert.type,
      title: cert.title || "",
      field: undefined,
      certificate_number: undefined,
      graduation_year: undefined,
      issued_date: undefined,
      expiry_date: undefined,
      issued_by: undefined,
      certificate_file: undefined,
      description: undefined,
      status: 'PENDING',
      is_verified: false,
      verified_at: undefined,
      verified_by: undefined,
    };

    if (cert.type === CertificateType.DEGREE) {
      if (cert.field) base.field = cert.field;
      if (cert.graduation_year) base.graduation_year = Number(cert.graduation_year);
      if (cert.certificate_file) base.certificate_file = cert.certificate_file;
    }

    if (cert.type === CertificateType.LICENSE) {
      if (cert.certificate_number) base.certificate_number = cert.certificate_number;
      if (cert.issued_by) base.issued_by = cert.issued_by;
      if (cert.issued_date) base.issued_date = cert.issued_date;
      if (cert.expiry_date) base.expiry_date = cert.expiry_date;
      if (cert.certificate_file) base.certificate_file = cert.certificate_file;
    }

    return base;
  };

  const handleSave = async () => {
    try {
      const doctorPayload: CreateDoctorDto = {
        full_name: formData.full_name,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        avatar: formData.avatar,
        phone: formData.phone || "",
        experience_years: formData.experience_years,
        bio: formData.bio,
        email: formData.email,
      }

      const doctor = await doctorService.createDoctor(doctorPayload)

      if (doctor) {
        for (const cert of formData.certificates) {
          const payload = prepareCertificatePayload(cert, doctor.id)
          await doctorService.createCertificate(payload)
        }

        if (formData.weeklyAvailability.length > 0) {
          await doctorService.createOrUpdateWeeklyAvailability(doctor.id, formData.weeklyAvailability)
        }

        handleClose()
        onSave?.()
        onAdded?.()
        setSuccessDialogOpen(true) // hiển thị dialog thành công
      } else {
        setErrorMessage("Tạo bác sĩ thất bại.")
        setErrorDialogOpen(true)
      }
    } catch (err) {
      console.error(err)
      setErrorMessage("Có lỗi xảy ra khi tạo bác sĩ.")
      setErrorDialogOpen(true)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1BasicInfo data={formData} setData={setFormData} setStepValid={setIsStep1Valid} />
      case 2: return <Step2Certificates data={formData} setData={setFormData} setStepValid={setIsStep1Valid} />
      case 3: return <Step3Schedule data={formData} setData={setFormData} />
      case 4: return <Step4Review data={formData} />
      default: return null
    }
  }

  return (
    <>
      <Dialog open={isOpen ?? open} onOpenChange={o => { if (!o) handleClose(); else setOpen(true) }}>
        <DialogContent className="w-[90vw] max-w-[1200px] h-[650px] p-6 flex flex-col overflow-hidden">
          <DialogHeader><DialogTitle>Thêm bác sĩ mới</DialogTitle></DialogHeader>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isCompleted ? "bg-green-500 border-green-500 text-white" : isActive ? "border-green-500 text-green-600 bg-green-50" : "border-gray-300 text-gray-400 bg-gray-100"}`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="ml-2">
                    <p className={`text-xs font-medium ${isActive ? "text-green-600" : isCompleted ? "text-gray-700" : "text-gray-400"}`}>Bước {step.id}</p>
                    <p className={`text-sm ${isActive ? "text-gray-900 font-medium" : isCompleted ? "text-gray-700" : "text-gray-400"}`}>{step.title}</p>
                  </div>
                  {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`} />}
                </div>
              )
            })}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-2">{renderStepContent()}</div>
            <DialogFooter className="mt-4 flex justify-between gap-2">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>Quay lại</Button>
              {currentStep < 4 ? (
                <Button type="button" onClick={() => { if (isStep1Valid) nextStep() }} disabled={!isStep1Valid}>Tiếp theo</Button>
              ) : (
                <Button type="button" onClick={handleSave}>Lưu bác sĩ</Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <SuccessDialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        title="Thêm bác sĩ thành công!"
        message="Bác sĩ đã được thêm vào hệ thống."
      />

      {/* Error Dialog */}
      <ErrorDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="Có lỗi xảy ra!"
        message={errorMessage}
        onRetry={handleSave}
      />
    </>
  )
}
