import { FC } from 'react';
import { Doctor, Appointment, Patient } from './types';

interface ConfirmationProps {
  doctor: Doctor;
  appointment: Appointment;
  patientInfo: Patient;
  onConfirm: () => void;
  onBack: () => void;
}

const Confirmation: FC<ConfirmationProps> = ({ doctor, appointment, patientInfo, onConfirm, onBack }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-blue-200 pb-2">Xác nhận thông tin đặt lịch</h2>
      <div className="space-y-8">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Thông tin bác sĩ</h3>
          <p className="text-gray-900 font-medium">{doctor.name} - {doctor.specialty}</p>
          <p className="text-gray-600">{doctor.hospital}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Thời gian khám</h3>
          <p className="text-gray-900 font-medium">{appointment.date?.toLocaleDateString('vi-VN')} - {appointment.time}</p>
          <p className="text-gray-600">
            Hình thức: {appointment.type === 'in-person' ? 'Trực tiếp' : appointment.type === 'online' ? 'Video' : 'Điện thoại'}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Thông tin bệnh nhân</h3>
          <p className="text-gray-900 font-medium">Họ tên: {patientInfo.fullName}</p>
          <p className="text-gray-900">Ngày sinh: {patientInfo.dob}</p>
          <p className="text-gray-900">Giới tính: {patientInfo.gender === 'male' ? 'Nam' : 'Nữ'}</p>
          <p className="text-gray-900">Số điện thoại: {patientInfo.phone}</p>
          <p className="text-gray-900">Email: {patientInfo.email || 'Không cung cấp'}</p>
          <p className="text-gray-900">Ghi chú: {patientInfo.note || 'Không có'}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Phí khám</h3>
          <p className="text-gray-900 font-medium">500.000 VNĐ</p>
          <p className="text-gray-600">
            Thanh toán: {patientInfo.paymentMethod === 'on-site' ? 'Tại chỗ' : patientInfo.paymentMethod === 'online' ? 'Online' : 'Bảo hiểm'}
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-all duration-300">
          Quay lại
        </button>
        <button onClick={onConfirm} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300">
          Xác nhận đặt lịch
        </button>
      </div>
    </div>
  );
};

export default Confirmation;