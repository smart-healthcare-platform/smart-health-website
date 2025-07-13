'use client';
import { FC, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Appointment } from './types';

interface AppointmentTimeProps {
  onSelectTime: (date: Date | null, time: string, type: Appointment['type']) => void;
  onNext: () => void;
  onBack: () => void;
}

const availableTimes = ['08:00 - 08:30', '08:30 - 09:00', '13:00 - 13:30', '13:30 - 14:00'];
const bookedTimes = ['08:30 - 09:00'];

const AppointmentTime: FC<AppointmentTimeProps> = ({ onSelectTime, onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<Appointment['type']>('in-person');

  const handleSubmit = () => {
    onSelectTime(selectedDate, selectedTime, appointmentType);
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Chọn thời gian khám</h2>
      <div className="mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          minDate={new Date()}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {availableTimes.map((time) => (
          <button
            key={time}
            disabled={bookedTimes.includes(time)}
            onClick={() => setSelectedTime(time)}
            className={`p-3 rounded-lg text-center ${selectedTime === time ? 'bg-blue-600 text-white' : bookedTimes.includes(time) ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-blue-100'} transition-all duration-300`}
          >
            {time}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Hình thức khám</h3>
        <select
          value={appointmentType}
          onChange={(e) => setAppointmentType(e.target.value as Appointment['type'])}
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="in-person">Trực tiếp tại cơ sở</option>
          <option value="online">Khám từ xa (video)</option>
          <option value="phone">Tư vấn qua điện thoại</option>
        </select>
      </div>
      <div className="flex justify-between">
        <button onClick={onBack} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300">
          Quay lại
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedTime}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default AppointmentTime;