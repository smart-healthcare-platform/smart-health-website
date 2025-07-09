'use client';
import { motion } from 'framer-motion';

interface DetailsProps {
  selectedSection: string;
}

export default function ProfileDetails({ selectedSection }: DetailsProps) {
  // Dữ liệu mẫu
  const personalInfo = {
    phone: '0901234567',
    email: 'nguyenvana@example.com',
  };

  const healthTimeline = {
    '3 months': 'Tình trạng ổn định, huyết áp bình thường.',
    '6 months': 'Phát hiện cholesterol cao, được khuyên ăn kiêng.',
    '12 months': 'Tái khám, cải thiện cholesterol, thêm kiểm tra đường huyết.',
  };

  const medicalHistory = [
    { id: 1, date: '2025-01-15', hospital: 'Bệnh viện Chợ Rẫy', diagnosis: 'Viêm họng' },
    { id: 2, date: '2025-04-10', hospital: 'BV Tim Tâm Đức', diagnosis: 'Kiểm tra tim mạch' },
  ];

  const prescriptions = [
    { id: 1, date: '2025-01-15', medicine: 'Paracetamol', dosage: '500mg, 2 lần/ngày' },
    { id: 2, date: '2025-04-10', medicine: 'Aspirin', dosage: '100mg, 1 lần/ngày' },
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'personalInfo':
        return (
          <div className="space-y-2 text-gray-700">
            <p>Số điện thoại: {personalInfo.phone}</p>
            <p>Email: {personalInfo.email}</p>
          </div>
        );
      case 'healthTimeline':
        return (
          <div className="space-y-2 text-gray-700">
            <p>3 tháng: {healthTimeline['3 months']}</p>
            <p>6 tháng: {healthTimeline['6 months']}</p>
            <p>12 tháng: {healthTimeline['12 months']}</p>
          </div>
        );
      case 'medicalHistory':
        return (
          <div className="space-y-2 text-gray-700">
            {medicalHistory.map((record) => (
              <p key={record.id}>
                {record.date} - {record.hospital}: {record.diagnosis}
              </p>
            ))}
          </div>
        );
      case 'prescriptions':
        return (
          <div className="space-y-2 text-gray-700">
            {prescriptions.map((prescription) => (
              <p key={prescription.id}>
                {prescription.date} - {prescription.medicine}: {prescription.dosage}
              </p>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {selectedSection === 'personalInfo' && 'Thông tin cá nhân'}
        {selectedSection === 'healthTimeline' && 'Tình hình sức khỏe'}
        {selectedSection === 'medicalHistory' && 'Lịch sử khám bệnh'}
        {selectedSection === 'prescriptions' && 'Đơn thuốc'}
      </h2>
      {renderContent()}
    </motion.div>
  );
}