'use client';
import { useState } from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import DoctorSelection from '@/app/(user)/booking/components/DoctorSelection';
import AppointmentTime from '@/app/(user)/booking/components/AppointmentTime';
import PatientInfo from '@/app/(user)/booking/components/PatientInfo';
import Confirmation from '@/app/(user)/booking/components/Confirmation';
import { Doctor, Appointment, Patient } from '@/app/(user)/booking/components/types';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointment, setAppointment] = useState<Appointment>({
    date: null,
    time: '',
    type: 'in-person',
  });
  const [patientInfo, setPatientInfo] = useState<Patient>({
    fullName: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    note: '',
    paymentMethod: 'on-site',
  });

  const steps = ['Chọn bác sĩ', 'Chọn thời gian', 'Thông tin cá nhân', 'Xác nhận'];

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleConfirm = () => {
    alert('Đặt lịch thành công!');
    window.location.href = '/';
  };

  return (
    <div className="container mx-auto py-8">
      <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 8, '& .MuiStepIcon-root': { color: '#93c5fd' }, '& .MuiStepIcon-completed': { color: '#1e40af' }, '& .MuiStepIcon-active': { color: '#1e40af' }, '& .MuiStepLabel-label': { fontWeight: 'bold' } }}>
        {steps.map((label, index) => (
          <Step key={label} completed={index < step - 1}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {step === 1 && (
        <DoctorSelection
          onSelectDoctor={(doctor) => {
            setSelectedDoctor(doctor);
            handleNext();
          }}
        />
      )}
      {step === 2 && (
        <AppointmentTime
          onSelectTime={(date, time, type) =>
            setAppointment({ date, time, type })
          }
          onNext={handleNext}
          onBack={handlePrev}
        />
      )}
      {step === 3 && (
        <PatientInfo
          onSubmit={(info) => setPatientInfo(info)}
          onNext={handleNext}
          onBack={handlePrev}
        />
      )}
      {step === 4 && selectedDoctor && (
        <Confirmation
          doctor={selectedDoctor}
          appointment={appointment}
          patientInfo={patientInfo}
          onConfirm={handleConfirm}
          onBack={handlePrev}
        />
      )}
    </div>
  );
}