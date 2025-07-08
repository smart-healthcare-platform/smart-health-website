// app/booking/page.tsx
'use client';
import Head from 'next/head';
import DoctorFilter from '@/components/ui/doctor/DoctorFilter';
import BookingForm from '@/components/ui/booking/BookingForm';
import { motion } from 'framer-motion';

export default function Booking() {
  const doctors = [
    { id: 1, name: 'BS. Nguyễn Văn A', specialty: 'Nội khoa', hospital: 'Bệnh viện Chợ Rẫy', image: '/images/doctor1.jpg' },
    { id: 2, name: 'BS. Trần Thị B', specialty: 'Nhi khoa', hospital: 'BV Nhi Đồng 1', image: '/images/doctor2.jpg' },
    { id: 3, name: 'BS. Lê Văn C', specialty: 'Tim mạch', hospital: 'BV Tim Tâm Đức', image: '/images/doctor3.jpg' },
    { id: 4, name: 'BS. Phạm Thị D', specialty: 'Nội khoa', hospital: 'BV Chợ Rẫy', image: '/images/doctor4.jpg' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Đặt lịch khám - Healthcare System</title>
        <meta name="description" content="Đặt lịch khám với bác sĩ dễ dàng và nhanh chóng." />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-200 py-12 text-gray-800">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Đặt lịch khám ngay hôm nay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Trải nghiệm dịch vụ y tế chuyên nghiệp với đội ngũ bác sĩ hàng đầu.
          </motion.p>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Đặt lịch khám</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Danh sách bác sĩ */}
            <div className="lg:col-span-1">
              <DoctorFilter doctors={doctors} />
            </div>

            {/* Form đặt lịch */}
            <div className="lg:col-span-2">
              <BookingForm doctors={doctors} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}