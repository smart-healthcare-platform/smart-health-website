'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Users, Calendar, Eye } from 'lucide-react';

interface DoctorCardProps {
  doctor: {
    id: number;
    name: string;
    specialty: string;
    hospital: string;
    image: string;
    experience?: number;
    rating?: number;
    patients?: number;
  };
  onBook: (doctor: any) => void;
}

export default function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Doctor Image & Badge */}
      <div className="relative p-6 pb-4">
        <div className="relative mx-auto w-24 h-24">
          <Image
            src={doctor.image}
            alt={doctor.name}
            width={96}
            height={96}
            className="rounded-2xl object-cover border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-2 -right-2 bg-emerald-600 w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        {/* Verified Badge */}
        <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
          Xác thực
        </div>
      </div>

      {/* Doctor Info */}
      <div className="px-6 pb-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
            {doctor.name}
          </h3>
          <p className="text-emerald-600 font-semibold mb-1">{doctor.specialty}</p>
          <div className="flex items-center justify-center text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {doctor.hospital}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{doctor.experience}+</div>
            <div className="text-xs text-gray-500">Năm KN</div>
          </div>
          <div>
            <div className="flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-lg font-bold text-gray-900">{doctor.rating}</span>
            </div>
            <div className="text-xs text-gray-500">Đánh giá</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{doctor.patients}+</div>
            <div className="text-xs text-gray-500">Bệnh nhân</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={`/doctors/${doctor.id}`} className="block">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:bg-emerald-50 group-hover:text-emerald-600">
              <Eye className="w-4 h-4" />
              <span>Xem chi tiết</span>
            </button>
          </Link>
          <button
            onClick={() => onBook(doctor)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Đặt lịch khám</span>
          </button>
        </div>
      </div>
    </div>
  );
}