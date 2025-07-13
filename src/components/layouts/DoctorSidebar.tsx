'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { useState } from 'react'
import {
  FaHome,
  FaCalendarAlt,
  FaUser,
  FaPrescription,
  FaUserEdit,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa'

const menu = [
  { label: 'Trang chủ', href: '/doctor', icon: FaHome },
  { label: 'Lịch hẹn', href: '/doctor/schedule', icon: FaCalendarAlt },
  { label: 'Bệnh nhân', href: '/doctor/patients', icon: FaUser },
  { label: 'Đơn thuốc', href: '/doctor/prescriptions', icon: FaPrescription },
  { label: 'Hồ sơ cá nhân', href: '/doctor/setting', icon: FaUserEdit },
  // { label: 'Cài đặt', href: '/doctor/setting', icon: FaCog },
]

export default function DoctorSidebar() {
  const pathname = usePathname()

  // Giả lập thông tin bác sĩ
  const doctorInfo = {
    name: 'Nguyễn Văn A',
    specialty: 'Nội khoa',
    avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
  }

  return (
    <aside className="w-64 bg-gradient-to-br from-blue-900 to-blue-600 text-white h-screen p-6 flex flex-col justify-between">
      {/* Thông tin bác sĩ */}
      <div>
        <div className="mb-10">
          <div className="flex items-center space-x-4">
            <img
              src={doctorInfo.avatar}
              alt={doctorInfo.name}
              className="w-14 h-14 rounded-full border-2 border-white shadow-md"
            />
            <div>
              <h3 className="text-xl font-bold">{doctorInfo.name}</h3>
              <p className="text-sm text-gray-100">{doctorInfo.specialty}</p>
            </div>
          </div>
        </div>

        {/* Menu chính */}
        <nav className="space-y-2">
          <ul className="space-y-1">
            {menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center px-4 py-2 rounded-xl hover:bg-blue-500 hover:bg-opacity-30 transition-colors duration-200',
                    pathname === item.href && 'bg-blue-700 text-white font-semibold'
                  )}
                >
                  <item.icon className="mr-3 text-lg" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Đăng xuất */}
      <div>
        <Link
          href="/logout"
          className={clsx(
            'flex items-center px-4 py-2 rounded-xl hover:bg-red-600 hover:bg-opacity-50 transition-colors duration-200',
            pathname === '/logout' && 'bg-red-700 text-white font-semibold'
          )}
        >
          <FaSignOutAlt className="mr-3 text-lg" />
          Đăng xuất
        </Link>
      </div>
    </aside>
  )
}