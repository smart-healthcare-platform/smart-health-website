"use client";

import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/index";
import { resetBooking } from "@/redux/slices/bookingSlice";
import BookingTimeline from "@/app/(protected)/user/booking/components/common/BookingTimeline";
import DoctorCard from "@/app/(protected)/user/booking/components/doctor/DoctorCard";
import { useEffect, useState } from "react";
import LoginRequiredDialog from "@/components/ui/require-login-dialog";
import { appointmentService } from "@/services/appointment.service";
import { CreateAppointmentPayload } from "@/types";
import SuccessDialog from "@/components/ui/success-dialog";
import ErrorDialog from "@/components/ui/error-dialog";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { doctor, slot_id, slot_start_time, formData } = useSelector(
    (state: RootState) => state.booking
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const step = parseInt(pathname.split("-")[1] || "1");

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (step === 1) dispatch(resetBooking());
  }, [step, dispatch]);

  useEffect(() => {
    if (step === 3 && !user) setShowLoginDialog(true);
  }, [step, user]);

  const canProceed = () => {
    if (step === 1) return !!doctor;
    if (step === 2) return !!slot_id && !!slot_start_time;
    if (step === 3)
      return formData.fullName && formData.phone && formData.birthDate && formData.gender;
    return true;
  };

  const handleNext = () => {
    if (step === 2 && !user) {
      setShowLoginDialog(true);
      return;
    }
    router.push(`/user/booking/step-${step + 1}`);
  };

  const handleBack = () => router.push(`/user/booking/step-${step - 1}`);

  const showSuccess = () => setSuccessDialogOpen(true);
  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!doctor || !slot_id || !slot_start_time || !user) return;

    setLoading(true);
    const payload: CreateAppointmentPayload = {
      doctorId: doctor.id,
      slotId: slot_id,
      userId: user.id,
      date: new Date(slot_start_time).toISOString(),
      type: "Khám bệnh",
      notes: formData.notes || "",
      doctorName:doctor.display_name,
      startAt:slot_start_time
    };

    try {
      await appointmentService.create(payload);
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

      <LoginRequiredDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        redirectPath={pathname}
      />

      <SuccessDialog
        open={successDialogOpen}
        onClose={() => {
          setSuccessDialogOpen(false);
          router.push("/");
        }}
        message="Bạn đã đặt lịch khám thành công!"
        onConfirm={() => {
          setSuccessDialogOpen(false);
          router.push("/");
        }}
      />

      <ErrorDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        message={errorMessage}
      />
    </div>
  );
}
