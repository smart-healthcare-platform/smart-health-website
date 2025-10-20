
"use client";
import DoctorList from "./DoctorList";
import AppPagination from "@/components/ui/global-pagination";
import { Doctor, DoctorDetail } from "@/types";

interface DoctorSelectionProps {
  doctors: Doctor[];
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  total: number;
  selectedDoctor: Doctor | DoctorDetail | null;
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
      <div className="relative">
        {/* <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nhập tên bác sĩ hoặc chuyên khoa..."
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-lg"
        />
      </div>
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
