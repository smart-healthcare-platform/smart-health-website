import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PatientFormData } from "@/types";
import { TimeSlot } from "@/types/timeSlot";
import { AppointmentCategory, AppointmentType } from "@/types/appointment/index";
import { Doctor, DoctorDetail } from "@/types/doctor/doctor.type";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
  address: string;
  notes: string
}

interface BookingState {
  doctor: Doctor | DoctorDetail | null;
  slot_id: string | null;
  slot_start_time: string | null;
  date: string | null;
  time: string | null;
  formData: PatientFormData;
  isFollowUp: boolean;
  followUpId: string | null
}

const initialState: BookingState = {
  slot_id: null,
  doctor: null,
  date: null,
  time: null,
  slot_start_time: null,
  isFollowUp: false,
  followUpId: null,
  formData: {
    fullName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    address: "",
    notes: "",
    type: AppointmentType.OFFLINE,
    category: AppointmentCategory.NEW,
  },
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setDoctor: (state, action: PayloadAction<Doctor | DoctorDetail>) => {
      state.doctor = action.payload;
    },
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload
      state.slot_id = null
      state.time = null
    },
    setSlot(state, action: PayloadAction<TimeSlot>) {
      state.slot_id = action.payload.id;
      state.time = action.payload.time;
      state.slot_start_time = action.payload.startTime;
    },
    setFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setFollowUpBooking: (
      state,
      action: PayloadAction<{ followUpId: string }>
    ) => {
      state.isFollowUp = true;
      state.followUpId = action.payload.followUpId
      state.formData.category = AppointmentCategory.FOLLOW_UP;
    },
    resetBooking: () => initialState,
  },
});

export const {
  setDoctor,
  setDate,
  setSlot,
  setFormData,
  resetBooking,
  setFollowUpBooking,
} = bookingSlice.actions;
export default bookingSlice.reducer;
