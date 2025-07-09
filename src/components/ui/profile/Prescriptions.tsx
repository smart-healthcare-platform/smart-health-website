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
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Đơn thuốc</h2>
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