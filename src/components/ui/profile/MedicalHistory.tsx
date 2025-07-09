'use client';
import { motion } from 'framer-motion';

export default function MedicalHistory() {
  const medicalHistory = [
    { id: 1, date: '2025-01-15', hospital: 'Bệnh viện Chợ Rẫy', diagnosis: 'Viêm họng', notes: 'Dùng thuốc 5 ngày' },
    { id: 2, date: '2025-04-10', hospital: 'BV Tim Tâm Đức', diagnosis: 'Kiểm tra tim mạch', notes: 'ECG bình thường' },
    { id: 3, date: '2025-06-20', hospital: 'BV Nhi Đồng 1', diagnosis: 'Khám sức khỏe định kỳ', notes: 'Tất cả ổn' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Lịch sử khám bệnh</h2>
      <div className="space-y-4 text-gray-700">
        {medicalHistory.map((record) => (
          <div key={record.id}>
            <p>
              {record.date} - {record.hospital}: {record.diagnosis}
            </p>
            <p className="text-sm text-gray-500">{record.notes}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}