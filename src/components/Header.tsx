'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-600 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Healthcare Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <h1 className="text-xl font-bold">Healthcare System</h1>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:underline hover:text-blue-200">
            Trang chủ
          </Link>
          <Link href="/booking" className="hover:underline hover:text-blue-200">
            Đặt lịch
          </Link>
          <Link href="/results" className="hover:underline hover:text-blue-200">
            Kết quả
          </Link>
          <Link href="/payment" className="hover:underline hover:text-blue-200">
            Thanh toán
          </Link>
          <Link href="/profile" className="hover:underline hover:text-blue-200">
            Hồ sơ
          </Link>
          <Link href="/auth/login" className="hover:underline hover:text-blue-200">
            Đăng nhập
          </Link>
        </nav>

        {/* Menu Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 flex flex-col space-y-2">
          <Link href="/" className="hover:underline hover:text-blue-200" onClick={toggleMenu}>
            Trang chủ
          </Link>
          <Link href="/booking" className="hover:underline hover:text-blue-200" onClick={toggleMenu}>
            Đặt lịch
          </Link>
          <Link href="/results" className="hover:underline hover:text-blue-200" onClick={toggleMenu}>
            Kết quả
          </Link>
          <Link href="/payment" className="hover:underline hover:text-blue-200" onClick={toggleMenu}>
            Thanh toán
          </Link>
          <Link href="/profile" className="hover:underline hover:text-blue-200" onClick={toggleMenu}>
            Hồ sơ
          </Link>
          <Link href="/auth/login" className="hover:underline hover:text-blue-200" onClick={toggleMenu}>
            Đăng nhập
          </Link>
        </nav>
      )}
    </header>
  );
}