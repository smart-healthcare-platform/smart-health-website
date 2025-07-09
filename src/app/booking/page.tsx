
'use client';
import Head from 'next/head';
import DoctorFilter from '@/components/ui/doctor/DoctorFilter';
import BookingForm from '@/components/ui/booking/BookingForm';
import { motion } from 'framer-motion';

export default function Booking() {
  const doctors = [
    {
      id: 1,
      name: 'BS. Nguyễn Văn A',
      specialty: 'Nội khoa',
      hospital: 'Bệnh viện Chợ Rẫy',
      image: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'BS. Trần Thị B',
      specialty: 'Nhi khoa',
      hospital: 'BV Nhi Đồng 1',
      image: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 3,
      name: 'BS. Lê Văn C',
      specialty: 'Tim mạch',
      hospital: 'BV Tim Tâm Đức',
      image: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: 4,
      name: 'BS. Phạm Thị D',
      specialty: 'Da liễu',
      hospital: 'BV Da Liễu TP.HCM',
      image: 'https://i.pravatar.cc/150?img=4',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Đặt lịch khám - Healthcare System</title>
        <meta name="description" content="Đặt lịch khám với bác sĩ dễ dàng và nhanh chóng." />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-300 py-20 text-white">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold"
          >
            Đặt lịch khám ngay hôm nay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Trải nghiệm dịch vụ y tế chuyên nghiệp với đội ngũ bác sĩ hàng đầu.
          </motion.p>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Đặt lịch khám</h2>
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
            {/* Bộ lọc bác sĩ */}
            <div className="lg:col-span-4">
              <DoctorFilter />
            </div>

            {/* Form đặt lịch */}
            <div className="lg:col-span-6">
              <BookingForm doctors={doctors} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}