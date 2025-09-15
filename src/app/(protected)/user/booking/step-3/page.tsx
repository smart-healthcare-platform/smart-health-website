"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/index";
import { setFormData } from "@/redux/slices/bookingSlice";
import PatientForm from "../components/form/PatientForm";

export default function Step3() {
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.booking);

  return (
    <PatientForm
      formData={formData}
      onFormChange={(data) => dispatch(setFormData(data))}
    />
  );
}
