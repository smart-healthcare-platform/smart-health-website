"use client";
import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "@/redux/slices/authSlice";
import { authService } from "@/services/auth.service";
import type { RootState } from "@/redux";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, isInitialized } = useSelector((state: RootState) => state.auth)
  const isAuthenticated = !!user

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), [])
  const toggleUserMenu = useCallback(() => setIsUserMenuOpen((prev) => !prev), [])

  // --- Logout ---
  const handleLogout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      dispatch(clearAuth())
      setIsUserMenuOpen(false)
      router.push("/")
    }
  }, [dispatch, router])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getUserInitials = (username?: string) =>
    username ? username.charAt(0).toUpperCase() : "U"

  const getAvatarColor = (username?: string) => {
    if (!username) return "bg-gray-500"
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500",
      "bg-pink-500", "bg-indigo-500", "bg-yellow-500", "bg-teal-500",
    ]
    return colors[username.charCodeAt(0) % colors.length]
  }

  // --- Static data ---
  const menuItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Đặt lịch", path: "/user/booking/step-1" },
    { name: "Bác sĩ", path: "/doctors" },
    { name: "Dịch vụ", path: "/services" },
    { name: "Hỗ trợ", path: "/support" },
  ];

  const userMenuItems = [
    { name: "Thông tin cá nhân", path: "/profile" },
    { name: "Lịch sử đặt khám", path: "/user/appointment-history" },
    { name: "Cài đặt", path: "/settings" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 fixed top-0 w-full z-50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                HealthSmart
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Sức khỏe thông minh</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">

            {/* User Menu hoặc Login Button với Loading State - Cố định kích thước */}
            <div className="hidden sm:block min-w-[120px]">
              {!isInitialized ? (
                // Loading skeleton với kích thước cố định
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="hidden md:block space-y-1">
                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-16 h-2 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : isAuthenticated ? (
                // User Menu
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-8 h-8 ${getAvatarColor(user.username)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {getUserInitials(user.username)}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase()}</p>
                    </div>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.path}
                          className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Login Button với kích thước cố định
                <Link
                  href="/login"
                  className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl min-w-[120px]"
                >
                  Đăng nhập
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="py-4 space-y-1">
              {/* Mobile Navigation Links */}
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="block px-4 py-3 font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded-lg"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Section với kích thước cố định */}
              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="min-h-[48px] flex items-center">
                  {!isInitialized ? (
                    // Mobile loading skeleton
                    <div className="mx-4 w-full h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  ) : isAuthenticated ? (
                    // Mobile user menu
                    <div className="space-y-1 w-full">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${getAvatarColor(user.username)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                            {getUserInitials(user.username)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.username}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase()}</p>
                          </div>
                        </div>
                      </div>
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.path}
                          className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          onClick={toggleMenu}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  ) : (
                    // Mobile login button
                    <Link
                      href="/login"
                      className="block mx-4 text-center bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-medium transition-colors"
                      onClick={toggleMenu}
                    >
                      Đăng nhập
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}