// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
          <p className="text-sm text-gray-200">
            Hệ thống chăm sóc sức khỏe thông minh, cung cấp dịch vụ đặt lịch khám, xem kết quả, và thanh toán tiện lợi.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2">
            {['Trang chủ', 'Đặt lịch', 'Kết quả', 'Thanh toán'].map((item) => (
              <li key={item}>
                <Link
                  href={item === 'Trang chủ' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm text-gray-200 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
          <p className="text-sm text-gray-200">Email: contact@healthcare.com</p>
          <p className="text-sm text-gray-200">Hotline: 0123 456 789</p>
          <p className="text-sm text-gray-200">Địa chỉ: 123 Đường Sức Khỏe, TP. HCM</p>
        </div>
      </div>

      <div className="mt-8 text-center border-t border-blue-400 pt-4">
        <p className="text-sm text-gray-200">© {new Date().getFullYear()} Healthcare System. All rights reserved.</p>
      </div>
    </footer>
  );
}