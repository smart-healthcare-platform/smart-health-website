"use client"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Eye, Star, Award } from "lucide-react"
import { Doctor } from "@/types/doctor/doctor.type"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

interface DoctorCardProps {
  doctor: Doctor
  onBook: (doctor: Doctor) => void
}

export default function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 p-6 flex flex-col">
      {/* Avatar + Rating */}
      <div className="text-center mb-6">
        <div className="mx-auto mb-4">
          <Avatar className="w-24 h-24 ring-4 ring-emerald-100 shadow-sm mx-auto">
            <AvatarImage
              src={doctor.avatar || "/placeholder.svg"}
              alt={doctor.full_name}
            />
            <AvatarFallback className="text-xl bg-emerald-500 text-white">
              {doctor.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-200"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">4.8 (127)</span>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900">
          {doctor.display_name || doctor.full_name}
        </h3>

        <div className="mt-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
            <Award className="w-4 h-4" />
            Tim mạch
          </span>
        </div>
      </div>


      {/* Experience */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
        <Clock className="w-4 h-4 text-emerald-500" />
        <span>{doctor.experience_years} năm kinh nghiệm</span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <Link href={`/doctors/${doctor.id}`} className="w-full">
          <button
            className="w-full py-3 px-5 
              border border-emerald-500 text-emerald-600 
              font-semibold rounded-xl 
              bg-white hover:bg-emerald-50
              shadow-sm hover:shadow-md 
              transition-all duration-300 ease-in-out 
              flex items-center justify-center gap-2 text-base
              transform hover:scale-[1.02] active:scale-95"
          >
            <Eye className="w-5 h-5" />
            Chi tiết
          </button>
        </Link>

        <button
          onClick={() => onBook(doctor)}
          className="w-full py-3 px-5 
            bg-gradient-to-r from-emerald-600 to-emerald-500 
            hover:from-emerald-700 hover:to-emerald-600
            text-white font-semibold rounded-xl 
            shadow-lg hover:shadow-xl 
            transition-all duration-300 ease-in-out 
            flex items-center justify-center gap-2 text-base
            transform hover:scale-[1.02] active:scale-95"
        >
          <Calendar className="w-5 h-5" />
          Đặt lịch
        </button>
      </div>
    </div>
  )
}
