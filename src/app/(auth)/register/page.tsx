'use client';
import { useState } from 'react';
import { UserPlus, Shield, Activity, Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';

export default function ModernHealthRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Vui lòng đồng ý với điều khoản sử dụng');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Register attempt:', { name, email, password });
      // Handle successful registration here
      setLoading(false);
    }, 2000);
  };

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return { strength: 0, text: '', color: '' };
    if (pwd.length < 6) return { strength: 25, text: 'Yếu', color: 'bg-red-500' };
    if (pwd.length < 8) return { strength: 50, text: 'Trung bình', color: 'bg-yellow-500' };
    if (pwd.length < 12) return { strength: 75, text: 'Mạnh', color: 'bg-blue-500' };
    return { strength: 100, text: 'Rất mạnh', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-16 right-10 w-36 h-36 bg-purple-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 left-16 w-28 h-28 bg-blue-100 rounded-full opacity-30 animate-bounce" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-24 right-1/4 w-44 h-44 bg-green-100 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Health icons floating */}
        <div className="absolute top-1/4 right-1/4 text-purple-200 opacity-30 animate-float">
          <UserPlus size={30} />
        </div>
        <div className="absolute top-3/4 left-1/3 text-blue-200 opacity-30 animate-float" style={{ animationDelay: '3s' }}>
          <Activity size={26} />
        </div>
        <div className="absolute bottom-1/4 right-1/2 text-green-200 opacity-30 animate-float" style={{ animationDelay: '5s' }}>
          <Shield size={28} />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Main register card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300">
            {/* Logo/Header section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
                <UserPlus className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Đăng Ký
              </h1>
              <p className="text-gray-600 text-sm">
                Tạo tài khoản để bắt đầu hành trình sức khỏe
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-r-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Register form */}
            <div className="space-y-5">
              {/* Name field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User size={16} className="text-purple-500" />
                  Tên đầy đủ
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="Nhập tên đầy đủ của bạn"
                    required
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

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
                    placeholder="Tạo mật khẩu mạnh"
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
                {/* Password strength indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Độ mạnh mật khẩu:</span>
                      <span className={`font-medium ${passwordStrength.strength > 50 ? 'text-green-600' : 'text-orange-600'}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock size={16} className="text-orange-500" />
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {/* Password match indicator */}
                  {confirmPassword && (
                    <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                      {password === confirmPassword ? (
                        <CheckCircle className="text-green-500" size={16} />
                      ) : (
                        <AlertCircle className="text-red-500" size={16} />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                    Điều khoản sử dụng
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                    Chính sách bảo mật
                  </a>
                </label>
              </div>

              {/* Register button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Tạo Tài Khoản
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">hoặc</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Social register options */}
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

            {/* Login link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Đã có tài khoản?{' '}
              <a href="#" className="font-medium text-purple-600 hover:text-purple-700">
                Đăng nhập ngay
              </a>
            </p>
          </div>

          {/* Footer features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="text-purple-500">
              <Shield className="mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Thông tin bảo mật</p>
            </div>
            <div className="text-blue-500">
              <UserPlus className="mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Đăng ký miễn phí</p>
            </div>
            <div className="text-green-500">
              <Activity className="mx-auto mb-2" size={20} />
              <p className="text-xs text-gray-600">Hỗ trợ 24/7</p>
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