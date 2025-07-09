// app/profile/components/ProfileMenu.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MenuProps {
  onSelect: (section: string) => void;
  selectedSection: string;
}

export default function ProfileMenu({ onSelect, selectedSection }: MenuProps) {
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Nguyễn Văn A',
    gender: 'Nam',
    dateOfBirth: '01/01/1990',
    phone: '0901234567',
    email: 'nguyenvana@example.com',
    avatar: '/images/avatar.png',
  });

  useEffect(() => {
    // Có thể fetch dữ liệu từ API ở đây
  }, []);

  const menuItems = [
    { id: 'personalInfo', label: 'Thông tin cá nhân' },
    { id: 'healthTimeline', label: 'Tình hình sức khỏe' },
    { id: 'medicalHistory', label: 'Lịch sử khám bệnh' },
    { id: 'prescriptions', label: 'Đơn thuốc' },
  ];

  return (
    <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-10 h-fit">
      <div className="flex items-center space-x-10 mb-12">
        <Image
          src={personalInfo.avatar}
          alt={personalInfo.name}
          width={120}
          height={120}
          className="rounded-full object-cover border-4 border-blue-100"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{personalInfo.name}</h2>
          <p className="text-lg text-gray-600">Bệnh nhân</p>
        </div>
      </div>
      <nav className="space-y-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full text-left px-8 py-4 rounded-xl text-xl font-medium ${
              selectedSection === item.id
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}