"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/index";
import { setDoctor } from "@/redux/slices/bookingSlice";
import DoctorSelection from "../components/doctor/DoctorSelection";
import { useState, useEffect, useCallback } from "react";
import { doctorService } from "@/services/doctor.service";
import useDebounce from "@/hooks/use-debounce";
import { Doctor } from "@/types";

const doctorsPerPage = 6;

export default function Step1() {
  const dispatch = useDispatch();
  const { doctor } = useSelector((state: RootState) => state.booking);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

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
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return (
    
    <DoctorSelection
      doctors={doctors}
      loading={loading}
      search={search}
      setSearch={setSearch}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      total={total}
      selectedDoctor={doctor}
      onDoctorSelect={(doc) => dispatch(setDoctor(doc))}
    />
  );
}
