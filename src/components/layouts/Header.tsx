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
  // Get user from Redux store
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!accessToken && !!user;

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // luôn luôn clear client
      dispatch(clearAuth());
      localStorage.clear();
      sessionStorage.clear();
      setIsUserMenuOpen(false);
      router.push("/doctor");
    }
  }, [dispatch]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate user avatar initials
  const getUserInitials = (username?: string) => {
    if (!username) return "U";
    return username.charAt(0).toUpperCase();
  };

  // Generate avatar background color based on username
  const getAvatarColor = (username?: string) => {
    if (!username) return "bg-gray-500";
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const menuItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Đặt lịch", path: "/user/booking/step-1" },
    { name: "Bác sĩ", path: "/doctors" },
    { name: "Dịch vụ", path: "/services" },
    { name: "Hỗ trợ", path: "/support" },
    {
      name: "Chuẩn đoán AI",
      path: "/diagnosis",
      isSpecial: true,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
  ];

  const userMenuItems = [
    {
      name: "Thông tin cá nhân",
      path: "/profile",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      name: "Lịch sử đặt khám",
      path: "/history",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      name: "Cài đặt",
      path: "/settings",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 fixed top-0 w-full z-50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
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
                className={`font-medium transition-all duration-200 relative group py-2 ${
                  item.isSpecial
                    ? "text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-800"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
              >
                {item.isSpecial ? (
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.name}</span>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                ) : (
                  <>
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full rounded-full" />
                  </>
                )}
              </Link>
            ))}
          </nav>

          {/* User Menu / Login Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* User Menu or Login Button */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="hidden sm:flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                >
                  {/* User Avatar */}
                  <div
                    className={`w-8 h-8 ${getAvatarColor(
                      user.username
                    )} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg`}
                  >
                    {getUserInitials(user.username)}
                  </div>
                  {/* User Name */}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                  {/* Dropdown Arrow */}
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 ${getAvatarColor(
                            user.username
                          )} rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}
                        >
                          {getUserInitials(user.username)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {user.username}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.path}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {item.icon}
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      ))}

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="font-medium">Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button for non-authenticated users */
              <Link
                href="/login"
                className="hidden sm:flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Đăng nhập</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="py-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`block px-4 py-3 font-medium transition-all duration-200 rounded-lg ${
                    item.isSpecial
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700 mx-2"
                      : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                  onClick={toggleMenu}
                >
                  {item.isSpecial ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                  ) : (
                    item.name
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
