// DoctorSelection.tsx
"use client";
import DoctorFilter from "@/app/(public)/doctors/components/DoctorFilter";
import DoctorList from "./DoctorList";
import AppPagination from "@/components/ui/AppPagination";
import { Doctor, DoctorDetail } from "@/types";

interface DoctorSelectionProps {
  doctors: Doctor[];
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  total: number;
  selectedDoctor: Doctor |DoctorDetail | null;
  onDoctorSelect: (doctor: Doctor) => void;
}

export default function DoctorSelection({
  doctors,
  loading,
  search,
  setSearch,
  currentPage,
  setCurrentPage,
  total,
  selectedDoctor,
  onDoctorSelect,
}: DoctorSelectionProps) {
  return (
    <div className="space-y-6">
      <DoctorList
        doctors={doctors}
        loading={loading}
        selectedDoctor={selectedDoctor}
        onDoctorSelect={onDoctorSelect}
        searchValue={search}
        setSearch={setSearch}
      />
      <AppPagination
        currentPage={currentPage}
        totalPages={Math.ceil(total / 6)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
