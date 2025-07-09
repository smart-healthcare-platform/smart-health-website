// app/doctors/page.tsx
'use client';
import DoctorList from '@/components/ui/doctor/DoctorList';
import DoctorFilter from '@/components/ui/doctor/DoctorFilter';
import { motion } from 'framer-motion';

export default function Doctors() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Đội Ngũ Bác Sĩ</h1>
        <DoctorFilter />
        <DoctorList />
      </motion.div>
    </div>
  );
}