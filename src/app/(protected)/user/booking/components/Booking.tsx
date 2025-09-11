"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import BookingTimeline from "./common/BookingTimeline";
import DoctorSelection from "./doctor/DoctorSelection";
import Calendar from "./slot/Calendar";
import TimeSlotGrid from "./slot/TimeSlotGrid";
import PatientForm from "./form/PatientForm";
import BookingSummary from "./form/BookingSummary";
import DoctorCard from "./doctor/DoctorCard";
import { Mail, Phone } from "lucide-react";
import type { Doctor } from "@/types";
import { doctorService } from "@/services/doctorService";
import useDebounce from "@/hooks/useDebounce";
import { TimeSlot } from "@/types/timeSlot";

const doctorsPerPage = 6;

const HealthSmartBooking = ({ doctorId }: { doctorId?: string }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [allSlots, setAllSlots] = useState<TimeSlot[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Doctor list state
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    address: "",
    symptoms: "",
  });

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await doctorService.getPublicDoctors(
        currentPage,
        doctorsPerPage,
        debouncedSearch.trim()
      );
      setDoctors(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
      setDoctors([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Fetch all slots of selected doctor
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctor) {
        setAllSlots([]);
        setAvailableDates([]);
        setTimeSlots([]);
        return;
      }
      setLoadingSlots(true);
      try {
        const slots = await doctorService.getDoctorSlots(selectedDoctor.id);
        setAllSlots(slots);
        console;
        // unique dates
        const dates = Array.from(new Set(slots.map((s) => s.date)));
        setAvailableDates(dates);
      } catch (err) {
        console.error(err);
        setAllSlots([]);
        setAvailableDates([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDoctor]);

  // Update timeSlots when selectedDate changes
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      setSelectedTime(null);
      return;
    }

    const dateStr = selectedDate.toISOString().split("T")[0];

    const slotsForDay = allSlots
      .filter((s) => s.date === dateStr)
      .sort((a, b) => {
        // Chuyển "HH:mm" -> số phút để sort
        const [aH, aM] = a.time.split(":").map(Number);
        const [bH, bM] = b.time.split(":").map(Number);
        return aH * 60 + aM - (bH * 60 + bM);
      });

    setTimeSlots(slotsForDay);
    setSelectedTime(null);
  }, [selectedDate, allSlots]);

  const SelectedDoctorCard = useMemo(() => {
    if (!selectedDoctor) return null;
    return (
      <DoctorCard doctor={selectedDoctor} isSelected onSelect={() => {}} />
    );
  }, [selectedDoctor]);

  const handleNext = () => currentStep < 4 && setCurrentStep(currentStep + 1);
  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const handleConfirmBooking = () => alert("Đặt lịch thành công!");

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedDoctor;
      case 2:
        return !!selectedDate && !!selectedTime;
      case 3:
        return (
          !!formData.fullName &&
          !!formData.phone &&
          !!formData.birthDate &&
          !!formData.gender
        );
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Đặt lịch khám bệnh
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kết nối bác sĩ, bệnh nhân cho trải nghiệm y tế đỉnh cao với công
            nghệ hiện đại nhất.
          </p>
        </div>

        {/* Timeline */}
        <BookingTimeline currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step content */}
            {currentStep === 1 && (
              <>
                <div className="mb-6">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 Nhập tên bác sĩ hoặc chuyên khoa..."
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-lg"
                  />
                </div>

                <DoctorSelection
                  doctors={doctors}
                  loading={loading}
                  search={search}
                  setSearch={setSearch}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  total={total}
                  selectedDoctor={selectedDoctor}
                  onDoctorSelect={setSelectedDoctor}
                />
              </>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  availableDates={availableDates}
                />
                <TimeSlotGrid
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  selectedDate={selectedDate}
                  timeSlots={timeSlots}
                  loading={loadingSlots}
                />
              </div>
            )}

            {currentStep === 3 && (
              <PatientForm formData={formData} onFormChange={setFormData} />
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
            {SelectedDoctorCard && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Bác sĩ đã chọn
                </h3>
                {SelectedDoctorCard}
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-xl border p-6 space-y-4">
              {currentStep < 4 ? (
                <>
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      canProceed()
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {currentStep === 3 ? "Xem lại thông tin" : "Tiếp tục"}
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

            {/* Support */}
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
              <h4 className="font-semibold text-emerald-900 mb-3">
                Cần hỗ trợ?
              </h4>
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
