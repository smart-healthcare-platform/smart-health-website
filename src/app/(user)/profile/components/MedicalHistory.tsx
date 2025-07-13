// app/profile/components/MedicalHistory.tsx
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import MedicalDetailModal from './MedicalDetailModal';

export default function MedicalHistory() {
  interface MedicalRecord {
    id: number;
    date: string;
    hospital: string;
    diagnosis: string;
    notes: string;
    doctor: string;
  }

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [filter, setFilter] = useState('newest');

  const medicalHistory = [
    { id: 1, date: '2025-01-15', hospital: 'Bệnh viện Chợ Rẫy', diagnosis: 'Viêm họng', notes: 'Dùng thuốc 5 ngày', doctor: 'BS. Nguyễn Văn B' },
    { id: 2, date: '2025-04-10', hospital: 'BV Tim Tâm Đức', diagnosis: 'Kiểm tra tim mạch', notes: 'ECG bình thường', doctor: 'BS. Trần Thị C' },
    { id: 3, date: '2025-06-20', hospital: 'BV Nhi Đồng 1', diagnosis: 'Khám sức khỏe định kỳ', notes: 'Tất cả ổn', doctor: 'BS. Lê Văn D' },
    { id: 4, date: '2025-07-05', hospital: 'BV Đại Học Y Dược', diagnosis: 'Cảm cúm', notes: 'Nghỉ ngơi 3 ngày', doctor: 'BS. Phạm Thị E' },
    { id: 5, date: '2025-07-08', hospital: 'BV Chợ Rẫy', diagnosis: 'Kiểm tra gan', notes: 'Chỉ số tốt', doctor: 'BS. Hoàng Văn F' },
    { id: 6, date: '2025-07-08', hospital: 'BV Chợ Rẫy', diagnosis: 'Kiểm tra gan', notes: 'Chỉ số tốt', doctor: 'BS. Hoàng Văn F' },
    { id: 7, date: '2025-07-08', hospital: 'BV Chợ Rẫy', diagnosis: 'Kiểm tra gan', notes: 'Chỉ số tốt', doctor: 'BS. Hoàng Văn F' },
    { id: 8, date: '2025-07-08', hospital: 'BV Chợ Rẫy', diagnosis: 'Kiểm tra gan', notes: 'Chỉ số tốt', doctor: 'BS. Hoàng Văn F' },
  ];

  const filteredHistory = [...medicalHistory].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    const now = Date.now();
    if (filter === 'newest') return dateB - dateA;
    if (filter === 'recent7days') {
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      return dateB >= sevenDaysAgo ? dateB - dateA : -1;
    }
    return dateA - dateB;
  }).filter(record => {
    if (filter === 'recent7days') {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return new Date(record.date).getTime() >= sevenDaysAgo;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 h-[550px] overflow-y-auto max-w-5xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Lịch sử khám bệnh</h2>
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Mới nhất</option>
          <option value="recent7days">Gần đây (7 ngày)</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 sticky top-0">
              <th className="p-3 text-sm font-medium text-gray-600 border-b border-gray-200">Ngày khám</th>
              <th className="p-3 text-sm font-medium text-gray-600 border-b border-gray-200">Bệnh viện</th>
              <th className="p-3 text-sm font-medium text-gray-600 border-b border-gray-200">Chẩn đoán</th>
              <th className="p-3 text-sm font-medium text-gray-600 border-b border-gray-200">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                <td className="p-3 text-gray-700">{record.date}</td>
                <td className="p-3 text-gray-700">{record.hospital}</td>
                <td className="p-3 text-gray-700">{record.diagnosis}</td>
                <td className="p-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRecord(record)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-all text-sm"
                  >
                    Xem chi tiết
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MedicalDetailModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </motion.div>
  );
}