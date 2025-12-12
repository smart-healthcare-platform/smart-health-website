"use client";

import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/index";
import { resetBooking } from "@/redux/slices/bookingSlice";
import BookingTimeline from "./components/common/BookingTimeline";
import DoctorCard from "./components/doctor/DoctorCard";
import { useEffect, useState } from "react";
import LoginRequiredDialog from "@/components/ui/require-login-dialog";
import { appointmentService } from "@/services/appointment.service";
import SuccessDialog from "@/components/ui/success-dialog";
import ErrorDialog from "@/components/ui/error-dialog";
import { getPatientProfile } from "@/lib/auth-helpers";
import { CreateAppointmentPayload } from "@/types/appointment/appointment.dto";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { doctor, slot_id, slot_start_time, formData } = useSelector(
    (state: RootState) => state.booking
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const step = parseInt(pathname.split("-")[1] || "1");

  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (step === 1) dispatch(resetBooking());
  }, [step, dispatch]);


  const canProceed = () => {
    if (step === 1) return !!doctor;
    if (step === 2) return !!slot_id && !!slot_start_time;
    if (step === 3)
      return formData.fullName && formData.phone && formData.birthDate && formData.gender;
    return true;
  };

  const handleNext = () => {
    router.push(`/booking/step-${step + 1}`);
  };

  const handleBack = () => router.push(`/booking/step-${step - 1}`);

  const showSuccess = () => setSuccessDialogOpen(true);
  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!doctor || !slot_id || !slot_start_time || !user) return;
    setLoading(true);
    const profile = getPatientProfile(user);

    const payload: CreateAppointmentPayload = {
      doctorId: doctor.id,
      doctorName: doctor.display_name || doctor.full_name,
      slotId: slot_id,
      startAt: slot_start_time,
      patientId: user.referenceId || "",
      patientName: profile?.fullName || "",
      type: formData.type,
      notes: formData.notes || "",
      followUpId: formData.followUpId
    };

    try {
      await appointmentService.create(payload);
      console.log(payload)
      dispatch(resetBooking());
      showSuccess();
    } catch (err: any) {
      console.error(err);
      showError(err.message || "Đặt lịch thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Đặt lịch khám bệnh</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kết nối bác sĩ, bệnh nhân cho trải nghiệm y tế đỉnh cao với công nghệ hiện đại nhất.
          </p>
        </div>

        <BookingTimeline currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">{children}</div>

          <div className="space-y-6">
            {doctor && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Bác sĩ đã chọn</h3>
                <DoctorCard doctor={doctor} isSelected onSelect={() => { }} />
              </div>
            )}

            <div className="bg-white rounded-xl border p-6 space-y-4">
              {step < 4 ? (
                <>
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${canProceed()
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {step === 3 ? "Xem lại thông tin" : "Tiếp tục"}
                  </button>
                  {step > 1 && (
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
                    disabled={loading}
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {loading && <span className="animate-spin">⏳</span>}
                    {loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
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
        </div>
      </div>

      <SuccessDialog
        open={successDialogOpen}
        onClose={() => {
          setSuccessDialogOpen(false);
          router.push("/");
        }}
        title="Đặt lịch thành công!"
        message="Yêu cầu đặt lịch đã được ghi nhận. Chúng tôi sẽ gửi thông báo sớm nhất đến bạn!"
        onConfirm={() => {
          setSuccessDialogOpen(false);
          router.push("/");
        }}
      />


      <ErrorDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="Có lỗi xảy ra"
        message={errorMessage}
      />

    </div>
  );
}
