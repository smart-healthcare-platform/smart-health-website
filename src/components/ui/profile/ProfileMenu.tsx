// app/profile/components/ProfileMenu.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiLogOut } from 'react-icons/fi'; 
import { motion } from 'framer-motion';
import ChangeAvatarModal from './modal/ChangeAvatarModal';

interface MenuProps {
  onSelect: (section: string) => void;
  selectedSection: string;
  onLogout: () => void; // Hàm đăng xuất
}

export default function ProfileMenu({ onSelect, selectedSection, onLogout }: MenuProps) {
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Nguyễn Văn A',
    gender: 'Nam',
    dateOfBirth: '01/01/1990',
    phone: '0901234567',
    email: 'nguyenvana@example.com',
    avatar: '/images/avatar.png',
  });
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  useEffect(() => {
    // Có thể fetch dữ liệu từ API ở đây
  }, []);

  const menuItems = [
    { id: 'personalInfo', label: 'Thông tin cá nhân' },
    { id: 'healthTimeline', label: 'Tình hình sức khỏe' },
    { id: 'medicalHistory', label: 'Lịch sử khám bệnh' },
    { id: 'prescriptions', label: 'Đơn thuốc' },
  ];

  const handleAvatarChange = (newAvatar: string) => {
    setPersonalInfo((prev) => ({ ...prev, avatar: newAvatar }));
    setIsAvatarModalOpen(false);
  };

  return (
    <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6 h-[550px] overflow-y-auto">
      <div className="flex items-center space-x-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAvatarModalOpen(true)}
          className="cursor-pointer"
        >
          <Image
            src={personalInfo.avatar}
            alt={personalInfo.name}
            width={100}
            height={100}
            className="rounded-full object-cover border-4 border-blue-100"
          />
        </motion.div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{personalInfo.name}</h2>
          <p className="text-sm text-gray-600">Bệnh nhân</p>
        </div>
      </div>
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full text-left px-6 py-3 rounded-lg text-base font-medium ${
              selectedSection === item.id
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all font-medium mt-6"
        >
          <FiLogOut className="mr-2" size={20} />
          Đăng xuất
        </motion.button>
      </div>
      <ChangeAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onAvatarChange={handleAvatarChange}
        currentAvatar={personalInfo.avatar}
      />
    </div>
  );
}