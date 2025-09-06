'use client';
import { useState } from 'react';
import { Heart, Shield, Activity, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useDispatch } from "react-redux"
import { setCredentials } from "@/store/slices/authSlice"
import { authService } from '@/services/authService';
import { useRouter } from "next/navigation"
export default function ModernHealthLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { token, user } = await authService.login(email, password)
      dispatch(setCredentials({ token, user }))
      if (user.role === "Admin") {
        router.push("/admin/dashboard")
      } else if (user.role === "Doctor") {
        router.push("/doctor/home")
      } else {
        router.push("/")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-24 h-24 bg-green-100 rounded-full opacity-30 animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-100 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Health icons floating */}
        <div className="absolute top-1/3 left-1/4 text-blue-200 opacity-30 animate-float">
          <Heart size={28} />
        </div>
        <div className="absolute top-2/3 right-1/3 text-green-200 opacity-30 animate-float" style={{ animationDelay: '2s' }}>
          <Activity size={24} />
        </div>
        <div className="absolute bottom-1/3 left-1/2 text-purple-200 opacity-30 animate-float" style={{ animationDelay: '4s' }}>
          <Shield size={26} />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main login card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300">
            {/* Logo/Header section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl mb-4 shadow-lg">
                <Heart className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                Đăng Nhập
              </h1>
              <p className="text-gray-600 text-sm">
                Chăm sóc sức khỏe thông minh của bạn
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-r-lg">
                {error}
              </div>
            )}

            {/* Login form */}
            <div className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail size={16} className="text-blue-500" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="Nhập email của bạn"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock size={16} className="text-green-500" />
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Login button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng Nhập'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">hoặc</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Social login options */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="w-5 h-5 bg-blue-600 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Chưa có tài khoản?{' '}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-700">
                Đăng ký ngay
              </a>
            </p>
          </div>

          {/* Footer features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="text-blue-500">
              <Shield className="mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Bảo mật cao</p>
            </div>
            <div className="text-green-500">
              <Heart className="mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Y tế chuyên nghiệp</p>
            </div>
            <div className="text-purple-500">
              <Activity className="mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Theo dõi 24/7</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}