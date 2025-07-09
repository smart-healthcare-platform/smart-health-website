'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface DoctorCardProps {
  doctor: {
    id: number;
    name: string;
    specialty: string;
    hospital: string;
    image: string;
  };
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-center space-x-6">
        <img
          src={doctor.image}
          alt={doctor.name}
          width={100}
          height={100}
          className="rounded-full object-cover border-2 border-blue-100"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
          <p className="text-sm text-gray-600">{doctor.specialty}</p>
          <p className="text-sm text-gray-500">{doctor.hospital}</p>
          <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
            Xem chi tiết
          </button>
        </div>
      </div>
    </motion.div>
  );
}