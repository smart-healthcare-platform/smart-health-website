import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Doctor, DoctorDetail } from '@/types/doctor/doctor.type';
import { PatientFormData } from '@/types';


interface BookingSummaryProps {
  selectedDoctor: Doctor | DoctorDetail | null;
  selectedDate: string | null;
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

        {selectedDate && selectedTime && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-500">Ngày khám</p>
                <p className="font-semibold">
                  {new Date(selectedDate).toLocaleDateString('vi-VN')}
                </p>
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

        <div className="p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-3">Thông tin bệnh nhân</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Họ tên:</span> <span className="font-medium">{formData.fullName || "---"}</span></div>
            <div><span className="text-gray-500">Điện thoại:</span> <span className="font-medium">{formData.phone || "---"}</span></div>
            <div><span className="text-gray-500">Dịch vụ:</span> <span className="font-medium">{formData.type || "---"}</span></div>
            <div><span className="text-gray-500">Ngày sinh:</span> <span className="font-medium">{formData.birthDate || "---"}</span></div>
            {formData.notes && (
              <div className="md:col-span-2">
                <span className="text-gray-500">Ghi chú / Triệu chứng:</span>
                <span className="font-medium ml-2">{formData.notes}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingSummary;
