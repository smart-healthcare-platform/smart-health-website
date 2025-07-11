// app/profile/components/HealthTimeline.tsx
'use client';
import { motion } from 'framer-motion';

export default function HealthTimeline() {
  const healthTimeline = {
    '3 months': 'Tình trạng ổn định, huyết áp bình thường (120/80 mmHg).',
    '6 months': 'Phát hiện cholesterol cao (210 mg/dL), được khuyên ăn kiêng.',
    '12 months': 'Tái khám, cholesterol giảm (180 mg/dL), thêm kiểm tra đường huyết (95 mg/dL).',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 max-h-[720px] overflow-y-auto max-w-5xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Tình hình sức khỏe</h2>
      <div className="space-y-4 text-gray-700">
        <p>3 tháng: {healthTimeline['3 months']}</p>
        <p>6 tháng: {healthTimeline['6 months']}</p>
        <p>12 tháng: {healthTimeline['12 months']}</p>
      </div>
    </motion.div>
  );
}