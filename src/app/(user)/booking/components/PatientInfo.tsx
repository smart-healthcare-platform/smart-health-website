'use client';
import { FC, useState } from 'react';
import { Patient } from './types';

interface PatientInfoProps {
  onSubmit: (info: Patient) => void;
  onNext: () => void;
  onBack: () => void;
}

const PatientInfo: FC<PatientInfoProps> = ({ onSubmit, onNext, onBack }) => {
  const [patientInfo, setPatientInfo] = useState<Patient>({
    fullName: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    note: '',
    paymentMethod: 'on-site',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(patientInfo);
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-blue-200 pb-2">Thông tin bệnh nhân</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nhập họ và tên"
            value={patientInfo.fullName}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="dob" className="text-sm font-medium text-gray-700 mb-1">Ngày sinh *</label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={patientInfo.dob}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-1">Giới tính *</label>
          <select
            id="gender"
            name="gender"
            value={patientInfo.gender}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Nhập số điện thoại"
            value={patientInfo.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Nhập email (tùy chọn)"
            value={patientInfo.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="note" className="text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
          <textarea
            id="note"
            name="note"
            placeholder="Nhập triệu chứng hoặc yêu cầu đặc biệt (tùy chọn)"
            value={patientInfo.note}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700 mb-1">Hình thức thanh toán</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={patientInfo.paymentMethod}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="on-site">Trả tại chỗ</option>
            <option value="online">Thanh toán online (VNPay, Momo, ZaloPay)</option>
            <option value="insurance">Bảo hiểm y tế</option>
          </select>
        </div>
      </form>
      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300">
          Quay lại
        </button>
        <button
          onClick={handleSubmit}
          disabled={!patientInfo.fullName || !patientInfo.dob || !patientInfo.gender || !patientInfo.phone}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default PatientInfo;