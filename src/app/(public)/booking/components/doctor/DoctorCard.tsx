"use client";
import Image from "next/image";
import { Award, Clock, Star, Eye } from "lucide-react";
import type { Doctor, DoctorDetail } from "@/types";

interface Props {
  doctor: Doctor | DoctorDetail;
  isSelected: boolean;
  onSelect: () => void;
}

export default function DoctorCard({ doctor, isSelected, onSelect }: Props) {
  return (
    <div
      className={`cursor-pointer rounded-2xl border p-6 flex flex-col transition-all duration-300 
        ${isSelected ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-gray-200 bg-white hover:shadow-lg"}
      `}
      onClick={onSelect}
    >
      {/* Avatar */}
      <div className="text-center mb-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-emerald-100 shadow-sm">
          <Image
            src={doctor.avatar || "/images/doctor-placeholder.png"}
            alt={doctor.full_name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name + Degree */}
        <h3 className="text-xl font-bold text-gray-900">{doctor.display_name}</h3>
        {/* <div className="mt-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
            <Award className="w-4 h-4" />
            {doctor.degree}
          </span>
        </div> */}

        <p className="text-sm text-gray-500 mt-2">{doctor.specialty}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-200"}`}
            />
          ))}
        </div>
        <span className="text-gray-600">4.8 (127)</span>
      </div>

      {/* Experience */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <Clock className="w-4 h-4 text-emerald-500" />
        <span>{doctor.experience_years} năm kinh nghiệm</span>
      </div>
    </div>
  );
}
