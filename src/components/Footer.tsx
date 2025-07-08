// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
          <p className="text-sm">
            Hệ thống chăm sóc sức khỏe thông minh, cung cấp dịch vụ đặt lịch khám, xem kết quả, và thanh toán tiện lợi.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:underline hover:text-blue-200">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/booking" className="hover:underline hover:text-blue-200">
                Đặt lịch
              </Link>
            </li>
            <li>
              <Link href="/results" className="hover:underline hover:text-blue-200">
                Kết quả
              </Link>
            </li>
            <li>
              <Link href="/payment" className="hover:underline hover:text-blue-200">
                Thanh toán
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
          <p className="text-sm">Email: contact@healthcare.com</p>
          <p className="text-sm">Hotline: 0123 456 789</p>
          <p className="text-sm">Địa chỉ: 123 Đường Sức Khỏe, TP. HCM</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center border-t border-blue-500 pt-4">
        <p className="text-sm">© 2025 Healthcare System. All rights reserved.</p>
      </div>
    </footer>
  );
}