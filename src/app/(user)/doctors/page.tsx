'use client';
import DoctorList from '@/app/(user)/doctors/components/DoctorList';
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
        <DoctorList />
      </motion.div>
    </div>
  );
}