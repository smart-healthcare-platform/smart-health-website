'use client';
import { useState, useEffect } from 'react';
import { UserPlus, Eye, EyeOff, Mail, Lock, User, AlertCircle, Phone, Calendar, MapPin } from 'lucide-react';
import { authService } from '@/services/auth.service';
import SuccessDialog from '@/components/ui/success-dialog';
import { handleUserLogin } from '@/lib/auth-helpers';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function ModernHealthRegister() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();



  const validateForm = () => {
    if (!fullName || !email || !phone || !dateOfBirth || !gender || !address || !password || !confirmPassword) {
      return 'Vui lòng điền đầy đủ thông tin';
    }
    if (password !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!acceptTerms) {
      return 'Vui lòng đồng ý với điều khoản sử dụng';
    }
    return '';
  };

  const submitRegistration = async () => {
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = { fullName, email, phone, dateOfBirth, gender, address, password };
      const result = await authService.register(payload);

      await handleUserLogin(result, dispatch, router);

      setDialogOpen(true);
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
                <UserPlus className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Đăng Ký
              </h1>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-r-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Họ tên</label>
                <div className="relative">
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 pl-12 bg-white/50 border rounded-xl" placeholder="Nhập họ tên" />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                <div className="relative">
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 pl-12 bg-white/50 border rounded-xl" placeholder="Nhập số điện thoại" />
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Email */}


              {/* DOB */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
                <div className="relative">
                  <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full px-4 py-3 pl-12 bg-white/50 border rounded-xl" />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Giới tính</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 bg-white/50 border rounded-xl">
                  <option value="">-- Chọn giới tính --</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 pl-12 bg-white/50 border rounded-xl" placeholder="Nhập email" />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                <div className="relative">
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 pl-12 bg-white/50 border rounded-xl" placeholder="Nhập địa chỉ" />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 pl-12 pr-12 bg-white/50 border rounded-xl" placeholder="Nhập mật khẩu" />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 pl-12 pr-12 bg-white/50 border rounded-xl" placeholder="Nhập lại mật khẩu" />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-5">
              <input type="checkbox" id="terms" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
              <label htmlFor="terms" className="text-sm text-gray-600">Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật</label>
            </div>

            <button onClick={submitRegistration} disabled={loading} className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl">
              {loading ? 'Đang xử lý...' : 'Tạo Tài Khoản'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Đăng ký thành công!"
        message={`Tài khoản của bạn ${username} đã được tạo.`}
        onConfirm={() => setDialogOpen(false)}
        confirmText="Vào trang đăng nhập"
      />
    </div>
  );
}
