import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PatientFormData, Doctor, DoctorDetail } from "@/types";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
  address: string;
  symptoms: string;
}

interface BookingState {
  doctor: Doctor | DoctorDetail | null;
  date: string | null;
  time: string | null;
  formData: PatientFormData;
}

const initialState: BookingState = {
  doctor: null,
  date: null,
  time: null,
  notes:null,
  formData: {
    fullName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    address: "",
    symptoms: "",

  },
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setDoctor: (state, action: PayloadAction<Doctor | DoctorDetail>) => {
      state.doctor = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload;
    },
    setFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetBooking: () => initialState,
  },
});

export const { setDoctor, setDate, setTime, setFormData, resetBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;
