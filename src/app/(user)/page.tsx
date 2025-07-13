import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
// import DoctorCard from "@/app/user/doctor/components/DoctorCard";
import Banner from '../../../public/image/home_banner.png';

export default function Home() {
  const features = [
    {
      icon: "📅",
      title: "Đặt lịch khám dễ dàng",
      description: "Chọn bác sĩ và khung giờ phù hợp chỉ với vài thao tác.",
    },
    {
      icon: "🧾",
      title: "Quản lý đơn thuốc thông minh",
      description: "Theo dõi và quản lý đơn thuốc mọi lúc, mọi nơi.",
    },
    {
      icon: "🔐",
      title: "Hồ sơ bệnh án bảo mật",
      description: "Dữ liệu được mã hóa và lưu trữ an toàn bằng Blockchain.",
    },
  ];

  const doctors = [
    {
      id: 1,
      name: "BS. Nguyễn Văn A",
      specialty: "Nội tổng quát",
      hospital: "Bệnh viện Chợ Rẫy",
      image: "https://randomuser.me/api/portraits/men/70.jpg",
    },
    {
      id: 2,
      name: "BS. Trần Thị B",
      specialty: "Nhi khoa",
      hospital: "BV Nhi Đồng 1",
      image: "https://randomuser.me/api/portraits/women/78.jpg",
    },
    {
      id: 3,
      name: "BS. Lê Văn C",
      specialty: "Tim mạch",
      hospital: "BV Tim Tâm Đức",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  ];

  const faqs = [
    {
      question: "Hướng dẫn đặt lịch khám",
      answer: "Chọn bác sĩ, khung giờ, và xác nhận lịch hẹn qua hệ thống trực tuyến.",
    },
    {
      question: "Blockchain dùng để làm gì?",
      answer: "Blockchain đảm bảo hồ sơ bệnh án minh bạch, không thể chỉnh sửa, và bảo mật tuyệt đối.",
    },
    {
      question: "Hệ thống bảo mật dữ liệu người dùng như thế nào?",
      answer: "Dữ liệu được mã hóa đầu cuối và lưu trữ trên hệ thống Blockchain an toàn.",
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn Hùng",
      feedback: "Hệ thống rất tiện lợi, tôi đặt lịch khám chỉ trong 2 phút!",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Trần Thị Mai",
      feedback: "Hồ sơ bệnh án được lưu trữ an toàn, tôi rất yên tâm.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Hệ thống Chăm sóc Sức khỏe Thông minh</title>
        <meta name="description" content="Hệ thống quản lý khám chữa bệnh thông minh sử dụng Blockchain." />
      </Head>
      <section className="relative bg-transparent text-gray-800" style={{ height: '600px' }}>
        <Image
          src={Banner}
          alt="Doctor and patient with technology"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="brightness-90"
        />
        <div className="container mx-auto relative z-10 flex flex-col items-center justify-center h-full py-10 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl text-center px-4 sm:px-6 font-sans antialiased tracking-wide bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
            Chăm sóc sức khỏe thông minh
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-4 sm:mb-6 max-w-xl sm:max-w-2xl md:max-w-3xl drop-shadow-lg text-center px-4 sm:px-6 font-sans antialiased leading-loose bg-gradient-to-r from-blue-100 to-blue-300 bg-clip-text text-transparent">
            Kết nối bác sĩ, bệnh nhân cho trải nghiệm y tế đỉnh cao.
          </p>
          <Link href="/booking">
            <button className="bg-blue-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-xl hover:bg-blue-700 transition-transform transform hover:scale-105 sm:hover:scale-110 font-sans antialiased">
              Đặt lịch ngay
            </button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gray-800">Giới thiệu hệ thống</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-12">
            Đây là hệ thống quản lý khám chữa bệnh thông minh, ứng dụng công nghệ Blockchain để lưu trữ hồ sơ bệnh án minh bạch và an toàn.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg text-center transition-transform hover:scale-105">
                <span className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 block text-blue-600">{feature.icon}</span>
                <h3 className="text-xl sm:text-2xl md:text-2xl font-semibold mb-2 sm:mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-sm sm:text-base md:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gray-800">Bác sĩ và chuyên khoa nổi bật</h2>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div> */}
          <div className="text-center mt-6 sm:mt-8 md:mt-12">
            <Link href="/doctors">
              <button className="bg-blue-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                Xem tất cả bác sĩ
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gray-800">Tra cứu – Hướng dẫn – Hỏi đáp</h2>
          <div className="max-w-xl sm:max-w-2xl md:max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 py-4 sm:py-6">
                <details className="group">
                  <summary className="flex justify-between items-center font-semibold text-lg sm:text-xl md:text-xl cursor-pointer text-blue-800 hover:text-blue-600 transition-colors">
                    {faq.question}
                    <span className="transition-transform group-open:rotate-180">
                      <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-sm sm:text-base md:text-base text-gray-600 mt-2 sm:mt-4">{faq.answer}</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gray-800">Phản hồi từ người dùng</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-2xl sm:max-w-3xl md:max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg flex items-center transition-transform hover:scale-105">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full mr-4 sm:mr-6"
                />
                <div>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 italic">"{testimonial.feedback}"</p>
                  <p className="text-blue-800 font-semibold mt-2 sm:mt-4 text-base sm:text-lg md:text-xl">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 md:mb-8 text-shadow-lg">
            Bắt đầu hành trình sức khỏe của bạn ngay hôm nay!
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 max-w-xl sm:max-w-2xl md:max-w-2xl mx-auto text-gray-200">
            Tạo tài khoản miễn phí để trải nghiệm dịch vụ chăm sóc sức khỏe thông minh hàng đầu.
          </p>
          <Link href="/signup">
            <button className="bg-white text-blue-600 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105">
              Đăng ký ngay
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}