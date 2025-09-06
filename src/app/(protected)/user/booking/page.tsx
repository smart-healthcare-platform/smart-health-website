'use client';
import { useState } from 'react';
import BookingTimeline from './components/BookingTimeline';
import DoctorSelection from './components/DoctorSelection';
import CalendarComponent from './components/Calendar';
import TimeSlotGrid, { TimeSlot } from './components/TimeSlotGrid';
import PatientForm from './components/PatientForm';
import BookingSummary from './components/BookingSummary';
import DoctorCard from './components/DoctorCard';
import { Mail, Phone } from 'lucide-react';
import { Doctor } from '@/types';


const HealthSmartBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Tất cả chuyên khoa");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: '',
    address: '',
    symptoms: ''
  });
  // Giả sử API trả về timeSlots (demo cứng)
  const timeSlots: TimeSlot[] = [
    { time: "08:00", status: "booked" },
    { time: "08:30", status: "available" },
    { time: "09:00", status: "off" },
    { time: "09:30", status: "available" },
    { time: "10:00", status: "expired" },
    { time: "10:30", status: "available" },
  ];
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "BS. Nguyễn Văn A",
      specialty: "Tim mạch",
      experience: "10 năm kinh nghiệm",
      rating: 4.8,
      image: "/images/doctor1.jpg",
      price: 500000,
    },
    {
      id: 2,
      name: "BS. Trần Thị B",
      specialty: "Da liễu",
      experience: "8 năm kinh nghiệm",
      rating: 4.5,
      image: "/images/doctor2.jpg",
      price: 400000,
    },
    {
      id: 3,
      name: "BS. Lê Văn C",
      specialty: "Nhi khoa",
      experience: "12 năm kinh nghiệm",
      rating: 4.9,
      image: "/images/doctor3.jpg",
      price: 600000,
    },
  ];

  const specialties: string[] = ["Tất cả chuyên khoa", "Tim mạch", "Da liễu", "Nhi khoa"];
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = () => {
    alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedDoctor !== null;
      case 2: return selectedDate !== null && selectedTime !== null;
      case 3: return formData.fullName && formData.phone && formData.birthDate && formData.gender;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đặt lịch khám bệnh</h1>
          <p className="text-gray-600 mt-2">Kết nối bác sĩ, bệnh nhân cho trải nghiệm y tế đỉnh cao với công nghệ hiện đại nhất.</p>
        </div>

        {/* Timeline */}
        <BookingTimeline currentStep={currentStep} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <DoctorSelection
                selectedDoctor={selectedDoctor}
                onDoctorSelect={(doctor) => setSelectedDoctor(doctor)}   // ✅ wrap lại
                selectedSpecialty={selectedSpecialty}
                onSpecialtyChange={setSelectedSpecialty}
                doctors={doctors}
                specialties={specialties}
              />
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <CalendarComponent
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
                <TimeSlotGrid
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  selectedDate={selectedDate}
                  timeSlots={timeSlots}
                />
              </div>
            )}

            {currentStep === 3 && (
              <PatientForm
                formData={formData}
                onFormChange={setFormData}
              />
            )}

            {currentStep === 4 && (
              <BookingSummary
                selectedDoctor={selectedDoctor}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                formData={formData}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Doctor Preview */}
            {selectedDoctor && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Bác sĩ đã chọn</h3>
                <DoctorCard
                  doctor={selectedDoctor}
                  isSelected={true}
                  onSelect={() => { }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-xl border p-6">
              <div className="space-y-4">
                {currentStep < 4 ? (
                  <>
                    <button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${canProceed()
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      {currentStep === 3 ? 'Xem lại thông tin' : 'Tiếp tục'}
                    </button>
                    {currentStep > 1 && (
                      <button
                        onClick={handleBack}
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Quay lại
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleConfirmBooking}
                      className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Xác nhận đặt lịch
                    </button>
                    <button
                      onClick={handleBack}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Sửa thông tin
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
              <h4 className="font-semibold text-emerald-900 mb-3">Cần hỗ trợ?</h4>
              <div className="space-y-2 text-sm text-emerald-700">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Hotline: 1900 1234</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@healthsmart.vn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthSmartBooking;