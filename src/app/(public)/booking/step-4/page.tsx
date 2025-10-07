"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/index";
import BookingSummary from "../components/form/BookingSummary";
import GuardWrapper from "@/components/auth/GuardWrapper";
export default function Step4() {
  const { doctor, date, time, formData } = useSelector((state: RootState) => state.booking);

  return (
    <GuardWrapper allowedRoles={["PATIENT"]}>
      <BookingSummary
        selectedDoctor={doctor}
        selectedDate={date}
        selectedTime={time}
        formData={formData}
      />
    </GuardWrapper>
  );
}
