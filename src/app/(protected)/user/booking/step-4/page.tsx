"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/index";
import BookingSummary from "../components/form/BookingSummary";
export default function Step4() {
  const { doctor, date, time, formData } = useSelector((state: RootState) => state.booking);

  return (
    <BookingSummary
      selectedDoctor={doctor}
      selectedDate={date}
      selectedTime={time}
      formData={formData}
    />
  );
}
