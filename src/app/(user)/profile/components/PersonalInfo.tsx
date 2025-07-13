// app/profile/components/PersonalInfo.tsx
'use client';
import { motion } from 'framer-motion';
import UpdateInfoModal from './UpdateInfoModal';
import ChangePasswordModal from './ChangePasswordModal';
import { useState } from 'react';

export default function PersonalInfo() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const personalInfo = {
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'nguyenvana@example.com',
    address: '123 Đường Sức Khỏe, TP. HCM',
    insurance: 'BHXH 123456789',
    idNumber: '123456789',
    emergencyContact: '0987654321 (Người thân)',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 h-[550px] overflow-y-auto max-w-5xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Thông tin cá nhân</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
          <div className="space-y-3">
            <p className="text-gray-700"><span className="font-medium">Họ và tên:</span> {personalInfo.name}</p>
            <p className="text-gray-700"><span className="font-medium">Số điện thoại:</span> {personalInfo.phone}</p>
            <p className="text-gray-700"><span className="font-medium">Email:</span> {personalInfo.email}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin bổ sung</h3>
          <div className="space-y-3">
            <p className="text-gray-700"><span className="font-medium">Địa chỉ:</span> {personalInfo.address}</p>
            <p className="text-gray-700"><span className="font-medium">Số bảo hiểm:</span> {personalInfo.insurance}</p>
            <p className="text-gray-700"><span className="font-medium">CMND/CCCD:</span> {personalInfo.idNumber}</p>
            <p className="text-gray-700"><span className="font-medium">Liên hệ khẩn cấp:</span> {personalInfo.emergencyContact}</p>
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-end space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsUpdateModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-medium"
        >
          Cập nhật thông tin
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPasswordModalOpen(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all font-medium"
        >
          Đổi mật khẩu
        </motion.button>
      </div>
      <UpdateInfoModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        personalInfo={personalInfo}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </motion.div>
  );
}