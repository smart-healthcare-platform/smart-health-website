// components/Header.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Optimize toggle function
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Prefetch pages for faster navigation
  const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Đặt lịch', path: '/booking' },
    // { name: 'Kết quả', path: '/results' },
    { name: 'Đội ngữ bác sĩ', path: '/doctors' },
    { name: 'Hồ sơ', path: '/profile' },
    { name: 'Đăng nhập', path: '/login' },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          {/* <Image
            src="/images/logo.png"
            alt="Healthcare Logo"
            width={40}
            height={40}
            className="rounded-full"
            priority // Prioritize loading logo
          /> */}
          <h1 className="text-xl font-bold">Healthcare System</h1>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              prefetch // Enable prefetch for faster navigation
              className="relative text-sm font-medium hover:text-white transition-all duration-300"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-blue-600 transition-colors focus:outline-none"
          >
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-600 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              prefetch
              className="block px-2 py-1 hover:bg-blue-700 rounded-md transition-colors font-medium text-sm"
              onClick={toggleMenu}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}