// app/page.tsx
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import DoctorCard from "@/components/ui/doctor/DoctorCard";

export default function Home() {
  const services = [
    {
      title: 'Đặt lịch khám',
      description: 'Chọn bác sĩ và thời gian phù hợp với bạn.',
      link: '/booking',
    },
    {
      title: 'Xem kết quả',
      description: 'Kiểm tra kết quả khám bệnh mọi lúc, mọi nơi.',
      link: '/results',
    },
    {
      title: 'Thanh toán hóa đơn',
      description: 'Thanh toán hóa đơn thuốc nhanh chóng, an toàn.',
      link: '/payment',
    },
  ];

  const doctors = [
    {
        id: 1,
        name: "BS. Nguyễn Văn A",
        specialty: "Nội tổng quát",
        hospital: "Bệnh viện Chợ Rẫy",
        image: "https://i.pravatar.cc/100?img=1",
    },
    {
        id: 2,
        name: "BS. Trần Thị B",
        specialty: "Nhi khoa",
        hospital: "BV Nhi Đồng 1",
        image: "https://i.pravatar.cc/100?img=2",
    },
    {
        id: 3,
        name: "BS. Lê Văn C",
        specialty: "Tim mạch",
        hospital: "BV Tim Tâm Đức",
        image: "https://i.pravatar.cc/100?img=3",
    },
];

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Hệ thống Chăm sóc Sức khỏe Thông minh</title>
        <meta name="description" content="Đặt lịch khám, xem kết quả, thanh toán hóa đơn dễ dàng." />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-blue-100 py-20 text-center">
        {/* <Image
          src="/images/hero-bg.jpg"
          // alt="Hero Background"
          layout="fill"
          objectFit="cover"
          className="opacity-50"
        /> */}
        <div className="container mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
            Chăm sóc sức khỏe thông minh, tiện lợi
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Đặt lịch khám, xem kết quả, thanh toán hóa đơn chỉ trong vài cú nhấp chuột.
          </p>
          <Link href="/booking">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Đặt lịch ngay
            </button>
          </Link>
        </div>
      </section>

      {/* Dịch vụ nổi bật */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">Dịch vụ của chúng tôi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
                <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link href={service.link}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Tìm hiểu thêm
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Giới thiệu bác sĩ */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">Đội ngũ bác sĩ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}