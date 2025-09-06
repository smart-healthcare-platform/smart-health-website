import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { Bot, HeartPulse, CalendarCheck, Stethoscope, Shield, Clock, Star, ChevronDown } from "lucide-react";
import Banner from '../../../public/image/home_banner.png';

export default function Home() {
  const features = [
    {
      icon: <Bot className="w-12 h-12 text-emerald-600 mx-auto mb-4" />,
      title: "Trò chuyện tư vấn cùng AI",
      description: "Chat bot hỗ trợ hỏi đáp y tế, giải đáp thắc mắc sức khỏe mọi lúc, mọi nơi.",
      color: "emerald"
    },
    {
      icon: <HeartPulse className="w-12 h-12 text-red-500 mx-auto mb-4" />,
      title: "Chuẩn đoán tim mạch thông minh",
      description: "Phân tích chỉ số (huyết áp, cholesterol, nhịp tim) để dự đoán nguy cơ tim mạch.",
      color: "red"
    },
    {
      icon: <CalendarCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />,
      title: "Đặt lịch khám & tư vấn",
      description: "Đặt lịch khám trực tiếp hoặc tư vấn online với bác sĩ uy tín chỉ trong vài bước.",
      color: "blue"
    },
  ];

  const stats = [
    { number: "10,000+", label: "Bệnh nhân tin tưởng", icon: <Stethoscope className="w-8 h-8" /> },
    { number: "50+", label: "Bác sĩ chuyên khoa", icon: <Shield className="w-8 h-8" /> },
    { number: "24/7", label: "Hỗ trợ liên tục", icon: <Clock className="w-8 h-8" /> },
  ];

  const faqs = [
    {
      question: "Hướng dẫn đặt lịch khám",
      answer: "Chọn bác sĩ, khung giờ phù hợp và xác nhận lịch hẹn qua hệ thống trực tuyến. Bạn sẽ nhận được thông báo xác nhận qua email và SMS.",
    },
    {
      question: "Blockchain được sử dụng như thế nào?",
      answer: "Blockchain đảm bảo hồ sơ bệnh án minh bạch, không thể chỉnh sửa và bảo mật tuyệt đối. Mọi thông tin y tế đều được mã hóa và lưu trữ an toàn.",
    },
    {
      question: "Hệ thống bảo mật dữ liệu như thế nào?",
      answer: "Dữ liệu được mã hóa đầu cuối và lưu trữ trên hệ thống Blockchain an toàn. Chúng tôi tuân thủ các tiêu chuẩn bảo mật quốc tế cao nhất.",
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn Hùng",
      role: "Kỹ sư IT",
      feedback: "Hệ thống rất tiện lợi và hiện đại. Tôi có thể đặt lịch khám chỉ trong 2 phút, rất tiết kiệm thời gian!",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    },
    {
      name: "Trần Thị Mai",
      role: "Giáo viên",
      feedback: "Hồ sơ bệnh án được lưu trữ an toàn và có thể truy cập mọi lúc. Tôi rất yên tâm khi sử dụng dịch vụ này.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      name: "Lê Minh Tuấn",
      role: "Doanh nhân",
      feedback: "Chatbot AI rất thông minh, có thể tư vấn sơ bộ và hướng dẫn tôi đến đúng chuyên khoa cần thiết.",
      image: "https://randomuser.me/api/portraits/men/25.jpg",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>HealthSmart - Hệ thống Chăm sóc Sức khỏe Thông minh</title>
        <meta name="description" content="Nền tảng chăm sóc sức khỏe thông minh với công nghệ AI và Blockchain, kết nối bác sĩ và bệnh nhân." />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50" style={{ minHeight: '90vh' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/5"></div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-16">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Chăm sóc sức khỏe
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> thông minh</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Kết nối bác sĩ, bệnh nhân cho trải nghiệm y tế đỉnh cao với công nghệ hiện đại nhất.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
                    <CalendarCheck className="w-5 h-5" />
                    <span>Đặt lịch ngay</span>
                  </button>
                </Link>
                <Link href="/doctors">
                  <button className="border-2 border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-600 font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
                    <Stethoscope className="w-5 h-5" />
                    <span>Tìm bác sĩ</span>
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-emerald-600 mb-2 flex justify-center">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <Image
                  src={Banner}
                  alt="Doctors and healthcare technology"
                  className="w-full h-full object-cover"
                  width={600}
                  height={500}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hệ thống quản lý sức khỏe thông minh với công nghệ AI tiên tiến, mang đến trải nghiệm y tế hoàn toàn mới
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                  <div className="text-center">
                    {feature.icon}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                  <div className={`mt-6 h-1 bg-gradient-to-r from-${feature.color}-400 to-${feature.color}-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Về HealthSmart
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Công nghệ tiên tiến cho sức khỏe của bạn
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                HealthSmart là hệ thống quản lý khám chữa bệnh thông minh, ứng dụng trí tuệ nhân tạo và công nghệ Blockchain để hỗ trợ chẩn đoán, tư vấn sức khỏe và quản lý hồ sơ bệnh án một cách an toàn, tiện lợi.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Bảo mật tuyệt đối với công nghệ Blockchain</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">AI hỗ trợ chẩn đoán và tư vấn thông minh</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Đội ngũ bác sĩ chuyên khoa hàng đầu</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-6 rounded-2xl">
                    <Bot className="w-12 h-12 text-emerald-600 mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">AI Assistant</h3>
                    <p className="text-sm text-gray-600">Trợ lý AI 24/7</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl">
                    <Shield className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Blockchain</h3>
                    <p className="text-sm text-gray-600">Bảo mật tuyệt đối</p>
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-2xl">
                    <HeartPulse className="w-12 h-12 text-red-600 mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Health Monitor</h3>
                    <p className="text-sm text-gray-600">Theo dõi sức khỏe</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl">
                    <CalendarCheck className="w-12 h-12 text-purple-600 mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Smart Booking</h3>
                    <p className="text-sm text-gray-600">Đặt lịch thông minh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Đội ngũ bác sĩ chuyên khoa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hơn 50 bác sĩ chuyên khoa hàng đầu, giàu kinh nghiệm, sẵn sàng tư vấn và chăm sóc sức khỏe cho bạn
            </p>
          </div>
          
          <div className="text-center">
            <Link href="/doctors">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center mx-auto space-x-2">
                <Stethoscope className="w-5 h-5" />
                <span>Khám phá đội ngũ bác sĩ</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Phản hồi từ người dùng
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hàng nghìn khách hàng đã tin tưởng và sử dụng dịch vụ của chúng tôi
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.feedback}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Câu hỏi thường gặp
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Giải đáp những thắc mắc phổ biến về dịch vụ và hệ thống của chúng tôi
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-8 cursor-pointer hover:bg-gray-50 transition-colors">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {faq.question}
                    </h3>
                    <ChevronDown className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform duration-300" />
                  </summary>
                  <div className="px-8 pb-8">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Bắt đầu hành trình sức khỏe ngay hôm nay
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Tạo tài khoản miễn phí để trải nghiệm dịch vụ chăm sóc sức khỏe thông minh hàng đầu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="bg-white text-emerald-600 font-bold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <span>Đăng ký miễn phí</span>
              </button>
            </Link>
            <Link href="/booking">
              <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold px-12 py-4 rounded-xl transition-all duration-300 flex items-center space-x-2">
                <CalendarCheck className="w-5 h-5" />
                <span>Đặt lịch ngay</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}