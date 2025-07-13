'use client';
import Link from 'next/link';
import { useState, useCallback } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Đặt lịch', path: '/booking' },
    { name: 'Đội ngũ bác sĩ', path: '/doctors' },
    { name: 'Hồ sơ', path: '/profile' },
    { name: 'Đăng nhập', path: '/login' },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white fixed top-0 w-full z-50 shadow-xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <h1 className="text-2xl font-bold">Healthcare System</h1>
        </div>
        <nav className="hidden md:flex space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              prefetch
              className="text-lg font-medium hover:text-gray-200 transition-colors relative group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-200 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 p-4 space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              prefetch
              className="block px-4 py-2 hover:bg-blue-800 rounded-md font-medium text-lg"
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
