"use client";
import Image from "next/image";
import { Clock, Star } from "lucide-react";
import type { Doctor, DoctorDetail } from "@/types/doctor/doctor.type";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

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
      <div className="text-center mb-6">
        <div
          className="
      w-24 h-24 mx-auto rounded-full overflow-hidden 
      bg-gray-100 
      border-[3px] border-gray-200 
      shadow-sm 
      transition-all duration-300 
      hover:shadow-md hover:border-emerald-300 hover:scale-[1.03]
    "
        >
          <Avatar className="w-full h-full">
            <AvatarImage
              src={doctor.avatar || "/placeholder.svg"}
              alt={doctor.full_name}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
            />

            <AvatarFallback
              className="
          w-full h-full flex items-center justify-center 
          text-lg font-semibold text-gray-700 
          bg-gradient-to-br from-emerald-300 to-emerald-500
          text-white
        "
            >
              {doctor.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
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
