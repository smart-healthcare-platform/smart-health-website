// app/profile/components/MedicalDetailModal.tsx
'use client';
import { motion } from 'framer-motion';

interface MedicalRecord {
  id?: number;
  date?: string;
  hospital?: string;
  diagnosis?: string;
  notes?: string;
  doctor?: string;
}

interface MedicalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord | null;
}

export default function MedicalDetailModal({ isOpen, onClose, record }: MedicalDetailModalProps) {
  if (!isOpen || !record) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Chi tiết khám bệnh</h3>
        <div className="space-y-4 text-gray-700">
          <p><span className="font-medium">Ngày khám:</span> {record.date}</p>
          <p><span className="font-medium">Bệnh viện:</span> {record.hospital}</p>
          <p><span className="font-medium">Chẩn đoán:</span> {record.diagnosis}</p>
          <p><span className="font-medium">Bác sĩ:</span> {record.doctor}</p>
          <p><span className="font-medium">Ghi chú:</span> {record.notes}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Đóng
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}