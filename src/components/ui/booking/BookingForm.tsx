// app/booking/components/BookingForm.tsx
'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
}

interface BookingFormProps {
  doctors: Doctor[];
}

export default function BookingForm({ doctors }: BookingFormProps) {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('Trực tiếp');

  // Tạo mảng ngày, tháng, năm
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() + i).toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDay || !selectedMonth || !selectedYear || !selectedTime) {
      toast.error('Vui lòng điền đầy đủ thông tin!', { theme: 'colored' });
      return;
    }
    const date = `${selectedDay}/${selectedMonth}/${selectedYear}`;
    toast.success(`Đặt lịch thành công cho ngày ${date}! Vui lòng kiểm tra email.`, { theme: 'colored' });
    setSelectedDoctor('');
    setSelectedDay('');
    setSelectedMonth('');
    setSelectedYear('');
    setSelectedTime('');
    setAppointmentType('Trực tiếp');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      {/* <h3 className="text-xl font-semibold text-gray-900 mb-6">Đặt lịch khám</h3> */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Bác sĩ</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn bác sĩ</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.name}>{doctor.name} - {doctor.specialty}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Ngày khám</label>
          <div className="flex space-x-2">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Ngày</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Tháng</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Năm</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Giờ khám</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn giờ</option>
            {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Loại hình khám</label>
          <select
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Trực tiếp">Trực tiếp</option>
            <option value="Online">Online</option>
          </select>
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Xác nhận đặt lịch
        </motion.button>
      </form>
    </motion.div>
  );
}