'use client';
import { motion } from 'framer-motion';

export default function PersonalInfo() {
  const personalInfo = {
    phone: '0901234567',
    email: 'nguyenvana@example.com',
    address: '123 Đường Sức Khỏe, TP. HCM',
    insurance: 'BHXH 123456789',
    emergencyContact: '0987654321 (Người thân)',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Thông tin cá nhân</h2>
      <div className="space-y-4 text-gray-700">
        <p>Số điện thoại: {personalInfo.phone}</p>
        <p>Email: {personalInfo.email}</p>
        <p>Địa chỉ: {personalInfo.address}</p>
        <p>Bảo hiểm: {personalInfo.insurance}</p>
        <p>Liên hệ khẩn cấp: {personalInfo.emergencyContact}</p>
      </div>
    </motion.div>
  );
}