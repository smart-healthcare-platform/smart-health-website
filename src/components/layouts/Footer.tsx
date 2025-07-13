import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-xl font-semibold mb-6">Về chúng tôi</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Healthcare System mang đến giải pháp chăm sóc sức khỏe thông minh với công nghệ Blockchain, đảm bảo minh bạch và an toàn.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-6">Dịch vụ</h3>
          <ul className="space-y-3">
            {['Đặt lịch', 'Xem kết quả', 'Quản lý hồ sơ', 'Thanh toán'].map((item) => (
              <li key={item}>
                <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-6">Hỗ trợ</h3>
          <ul className="space-y-3">
            {['Hỏi đáp', 'Hướng dẫn', 'Liên hệ'].map((item) => (
              <li key={item}>
                <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-6">Liên hệ</h3>
          <p className="text-gray-300 text-sm mb-2">Email: support@healthcare.com</p>
          <p className="text-gray-300 text-sm mb-2">Hotline: 0123 456 789</p>
          <p className="text-gray-300 text-sm">Địa chỉ: 123 Đường Sức Khỏe, TP. HCM</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 3h2v5h-2z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center border-t border-blue-700 pt-6">
        <p className="text-gray-300 text-sm">© {new Date().getFullYear()} Healthcare System. All rights reserved.</p>
      </div>
    </footer>
  );
}
