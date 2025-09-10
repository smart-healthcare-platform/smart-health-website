import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Doctor, PatientFormData } from '@/types';

interface BookingSummaryProps {
  selectedDoctor: Doctor | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  formData: PatientFormData;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ 
  selectedDoctor, 
  selectedDate, 
  selectedTime, 
  formData 
}) => {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Xác nhận thông tin đặt lịch</h3>
      
      <div className="space-y-6">
        {/* Doctor Info */}
        {selectedDoctor && (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{selectedDoctor.name}</h4>
              <p className="text-emerald-600 text-sm">{selectedDoctor.specialty}</p>
              <p className="text-gray-500 text-sm">{selectedDoctor.experience}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{selectedDoctor.price.toLocaleString()}đ</p>
            </div>
          </div>
        )}
        
        {/* Date & Time */}
        {selectedDate && selectedTime && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-500">Ngày khám</p>
                <p className="font-semibold">{selectedDate.toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-500">Giờ khám</p>
                <p className="font-semibold">{selectedTime}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Patient Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-3">Thông tin bệnh nhân</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Họ tên:</span> <span className="font-medium">{formData.fullName || "---"}</span></div>
            <div><span className="text-gray-500">Điện thoại:</span> <span className="font-medium">{formData.phone || "---"}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="font-medium">{formData.email || "---"}</span></div>
            <div><span className="text-gray-500">Ngày sinh:</span> <span className="font-medium">{formData.birthDate || "---"}</span></div>
            {formData.symptoms && (
              <div className="md:col-span-2">
                <span className="text-gray-500">Triệu chứng:</span> 
                <span className="font-medium ml-2">{formData.symptoms}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Total */}
        {selectedDoctor && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
              <span className="text-2xl font-bold text-emerald-600">{selectedDoctor.price.toLocaleString()}đ</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;