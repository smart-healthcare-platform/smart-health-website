// app/booking/page.tsx
import ProtectedRoute from "@/components/ProtectedRoute";
import HealthSmartBooking from "./components/Booking";

export default function BookingPage() {
  return (
    <ProtectedRoute>
      <HealthSmartBooking />
    </ProtectedRoute>
  );
}
