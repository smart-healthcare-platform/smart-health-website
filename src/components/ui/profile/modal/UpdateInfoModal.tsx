// app/profile/components/UpdateInfoModal.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  insurance: string;
  idNumber: string;
  emergencyContact: string;
}

interface UpdateInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalInfo: PersonalInfo;
}

export default function UpdateInfoModal({ isOpen, onClose, personalInfo }: UpdateInfoModalProps) {
  const [formData, setFormData] = useState(personalInfo);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    setError('');
    alert('Cập nhật thông tin thành công!');
    onClose();
  };

  if (!isOpen) return null;

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
        className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-gray-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Cập nhật thông tin</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và tên *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2 w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Số điện thoại *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-2 w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2 w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-2 w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Số bảo hiểm</label>
              <input
                type="text"
                value={formData.insurance}
                onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                className="mt-2 w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số bảo hiểm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CMND/CCCD</label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="mt-2 w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập CMND/CCCD"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Liên hệ khẩn cấp</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="mt-2 w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập liên hệ khẩn cấp"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-400 transition-all"
            >
              Hủy
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all"
            >
              Lưu thay đổi
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}