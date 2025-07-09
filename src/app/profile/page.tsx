// app/profile/page.tsx
'use client';
import ProfileMenu from '@/components/ui/profile/ProfileMenu';
import { useState } from 'react';
import { motion } from 'framer-motion';
import PersonalInfo from '@/components/ui/profile/PersonalInfo';
import HealthTimeline from '@/components/ui/profile/HealthTimeline';
import MedicalHistory from '@/components/ui/profile/MedicalHistory';
import Prescriptions from '@/components/ui/profile/Prescriptions';

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
        <ProfileMenu onSelect={handleSectionChange} selectedSection={selectedSection} />
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