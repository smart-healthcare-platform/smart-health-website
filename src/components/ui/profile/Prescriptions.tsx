// app/profile/components/Prescriptions.tsx
'use client';
import { motion } from 'framer-motion';

export default function Prescriptions() {
  const prescriptions = [
    { id: 1, date: '2025-01-15', medicine: 'Paracetamol', dosage: '500mg, 2 lần/ngày', duration: '5 ngày' },
    { id: 2, date: '2025-04-10', medicine: 'Aspirin', dosage: '100mg, 1 lần/ngày', duration: '10 ngày' },
    { id: 3, date: '2025-06-20', medicine: 'Vitamin C', dosage: '1000mg, 1 lần/ngày', duration: '30 ngày' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 max-h-[720px] overflow-y-auto max-w-5xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Đơn thuốc</h2>
      <div className="space-y-4 text-gray-700">
        {prescriptions.map((prescription) => (
          <div key={prescription.id}>
            <p>
              {prescription.date} - {prescription.medicine}: {prescription.dosage}
            </p>
            <p className="text-sm text-gray-500">Thời gian: {prescription.duration}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}