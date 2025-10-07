// app/profile/page.tsx
'use client';
import ProfileMenu from '@/app/(user)/profile/components/ProfileMenu';
import { useState } from 'react';
import { motion } from 'framer-motion';
import PersonalInfo from '@/app/(user)/profile/components/PersonalInfo';
import HealthTimeline from '@/app/(user)/profile/components/HealthTimeline';
import MedicalHistory from '@/app/(user)/profile/components/MedicalHistory';
import Prescriptions from '@/app/(user)/profile/components/Prescriptions';

export default function Profile() {
  const [selectedSection, setSelectedSection] = useState('personalInfo');

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-16 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-10"
      >
        <ProfileMenu
          onSelect={handleSectionChange}
          selectedSection={selectedSection}
          onLogout={() => {
            // xử lý đăng xuất tại đây (ví dụ: xóa token, chuyển hướng...)
            console.log('User logged out');
            // hoặc:
            // router.push('/login')
          }}
        />
        <div className="lg:col-span-7">
          {selectedSection === 'personalInfo' && <PersonalInfo />}
          {selectedSection === 'healthTimeline' && <HealthTimeline />}
          {selectedSection === 'medicalHistory' && <MedicalHistory />}
          {selectedSection === 'prescriptions' && <Prescriptions />}
        </div>
      </motion.div>
    </div>
  );
}