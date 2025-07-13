'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface DoctorCardProps {
  doctor: {
    id: number;
    name: string;
    specialty: string;
    hospital: string;
    image: string;
  };
  onBook: (doctor: any) => void;
}

export default function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 w-full max-w-sm mx-auto"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Image
            src={doctor.image}
            alt={doctor.name}
            width={100}
            height={100}
            className="rounded-full object-cover border-2 border-blue-100"
          />
          <div className="absolute -bottom-2 -right-2 bg-blue-600 w-5 h-5 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✔</span>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
          <p className="text-sm text-gray-600">{doctor.specialty}</p>
          <p className="text-xs text-gray-500 italic">{doctor.hospital}</p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Link href={`/doctors/${doctor.id}`}>
            <button className="w-full bg-blue-600 text-white font-medium py-2 rounded-full hover:bg-blue-700 transition-colors duration-300">
              Xem chi tiết
            </button>
          </Link>
          <button
            onClick={() => onBook(doctor)}
            className="w-full bg-green-600 text-white font-medium py-2 rounded-full hover:bg-green-700 transition-colors duration-300"
          >
            Đặt lịch khám ngay
          </button>
        </div>
      </div>
    </motion.div>
  );
}