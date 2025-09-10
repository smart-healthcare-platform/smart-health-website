"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import BookingTimeline from "./common/BookingTimeline";
import DoctorSelection from "./doctor/DoctorSelection";
import Calendar from "./slot/Calendar";
import TimeSlotGrid, { TimeSlot } from "./slot/TimeSlotGrid";
import PatientForm from "./form/PatientForm";
import BookingSummary from "./form/BookingSummary";
import DoctorCard from "./doctor/DoctorCard";
import { Mail, Phone } from "lucide-react";
import { Doctor } from "@/types";
import { doctorService } from "@/services/doctorService";
import useDebounce from "@/hooks/useDebounce";

const doctorsPerPage = 6;

const HealthSmartBooking = ({ doctorId }: { doctorId?: string }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Doctor list state
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    address: "",
    symptoms: "",
  });

  // Debounce & refs to optimize search
  const debouncedSearchRef = useRef(search);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  // Fetch doctors (optimized)
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const searchTerm = debouncedSearch.trim();
      const res = await doctorService.getPublicDoctors(
        currentPage,
        doctorsPerPage,
        searchTerm
      );
      setDoctors(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
      setDoctors([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctor || !selectedDate) {
        setTimeSlots([]);
        return;
      }

      setLoadingSlots(true);
      try {
        const allSlots = await doctorService.getDoctorSlots(selectedDoctor.id);

        // Filter theo ngày đã chọn
        const filteredSlots = allSlots.filter((slot) => {
          const slotDate = new Date(
            `${selectedDate.toDateString()} ${slot.time}`
          );
          return slotDate.toDateString() === selectedDate.toDateString();
        });

        setTimeSlots(filteredSlots);
      } catch (err) {
        console.error(err);
        setTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  // Debounced search update
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setIsSearching(true);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      if (debouncedSearchRef.current !== newSearch.trim()) {
        setCurrentPage(1);
        debouncedSearchRef.current = newSearch.trim();
      }
      setIsSearching(false);
    }, 500);
  }, []);

  // Handle doctor selection
  const handleDoctorSelect = useCallback((doctor: Doctor) => {
    setSelectedDoctor(doctor);
  }, []);

  // Memoized selected doctor card
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
        return selectedDoctor !== null;
      case 2:
        return selectedDate && selectedTime;
      case 3:
        return (
          formData.fullName &&
          formData.phone &&
          formData.birthDate &&
          formData.gender
        );
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Đặt lịch khám bệnh
          </h1>
          <p className="text-gray-600 mt-2">
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
                <div className="mb-4">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Nhập tên bác sĩ..."
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <DoctorSelection
                  doctors={doctors}
                  loading={loading}
                  search={search}
                  setSearch={handleSearchChange}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  total={total}
                  selectedDoctor={selectedDoctor}
                  onDoctorSelect={handleDoctorSelect}
                  isSearching={isSearching}
                />
              </>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <Calendar
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
