// DoctorList.tsx
"use client";
import DoctorCard from "./DoctorCard";
import Loading from "@/components/ui/loading";
import { Doctor, DoctorDetail } from "@/types";

interface DoctorListProps {
  doctors: Doctor[];
  loading: boolean;
  selectedDoctor: Doctor |DoctorDetail| null;
  onDoctorSelect: (doctor: Doctor) => void;
  searchValue: string;
  setSearch: (value: string) => void;
}

export default function DoctorList({
  doctors,
  loading,
  selectedDoctor,
  onDoctorSelect,
  searchValue,
  setSearch,
}: DoctorListProps) {
  if (loading && doctors.length === 0) return <Loading />;

  if (!doctors.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-gray-500 text-lg">
          {searchValue
            ? `Không tìm thấy bác sĩ với từ khóa "${searchValue}"`
            : "Chưa có bác sĩ nào."}
        </p>
        {searchValue && (
          <button
            onClick={() => setSearch("")}
            className="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          isSelected={selectedDoctor?.id === doctor.id}
          onSelect={() => onDoctorSelect(doctor)}
        />
      ))}
    </div>
  );
}
