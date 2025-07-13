'use client';
import { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const BookingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<{
    id: number;
    name: string;
    specialty: string;
    hospital: string;
    image: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    fullName: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    note: ''
  });
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [paymentMethod, setPaymentMethod] = useState('on-site');

  const availableTimes = ['08:00 - 08:30', '08:30 - 09:00', '13:00 - 13:30', '13:30 - 14:00'];
  const bookedTimes = ['08:30 - 09:00'];

  useEffect(() => {
    const doctorId = searchParams.get('doctorId');
    if (doctorId) {
      setSelectedDoctor({
        id: parseInt(doctorId),
        name: searchParams.get('doctorName') || '',
        specialty: searchParams.get('specialty') || '',
        hospital: searchParams.get('hospital') || '',
        image: searchParams.get('image') || ''
      });
      setStep(2); // Chuyển sang bước chọn thời gian
    }
  }, [searchParams]);

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  const handleConfirm = () => {
    alert('Đặt lịch thành công!');
    router.push('/booking/confirmation');
  };

  const steps = ['Chọn bác sĩ', 'Chọn thời gian', 'Thông tin cá nhân', 'Xác nhận'];

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Stepper activeStep={step - 1} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {step === 1 && <div className="bg-white p-6 rounded-lg shadow-md">Vui lòng chọn bác sĩ từ danh sách.</div>}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Chọn thời gian khám</h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border rounded p-2 mb-4 w-full"
            minDate={new Date()}
          />
          <div className="grid grid-cols-2 gap-2">
            {availableTimes.map((time) => (
              <button
                key={time}
                disabled={bookedTimes.includes(time)}
                onClick={() => setSelectedTime(time)}
                className={`p-2 rounded ${
                  selectedTime === time
                    ? 'bg-blue-600 text-white'
                    : bookedTimes.includes(time)
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-blue-100'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePrevStep}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Quay lại
            </button>
            <button
              onClick={handleNextStep}
              disabled={!selectedTime}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Thông tin bệnh nhân</h2>
          <form className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Họ và tên"
              value={patientInfo.fullName}
              onChange={(e) => setPatientInfo({ ...patientInfo, fullName: e.target.value })}
              className="border rounded p-2"
            />
            <input
              type="date"
              placeholder="Ngày sinh"
              value={patientInfo.dob}
              onChange={(e) => setPatientInfo({ ...patientInfo, dob: e.target.value })}
              className="border rounded p-2"
            />
            <select
              value={patientInfo.gender}
              onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
              className="border rounded p-2"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
            <input
              type="tel"
              placeholder="Số điện thoại"
              value={patientInfo.phone}
              onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
              className="border rounded p-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={patientInfo.email}
              onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
              className="border rounded p-2"
            />
            <textarea
              placeholder="Ghi chú (triệu chứng, yêu cầu đặc biệt,...)"
              value={patientInfo.note}
              onChange={(e) => setPatientInfo({ ...patientInfo, note: e.target.value })}
              className="border rounded p-2"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">Hình thức khám</h3>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="border rounded p-2 w-full"
              >
                <option value="in-person">Trực tiếp tại cơ sở</option>
                <option value="online">Khám từ xa (video)</option>
                <option value="phone">Tư vấn qua điện thoại</option>
              </select>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Hình thức thanh toán</h3>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border rounded p-2 w-full"
              >
                <option value="on-site">Trả tại chỗ</option>
                <option value="online">Thanh toán online (VNPay, Momo, ZaloPay)</option>
                <option value="insurance">Bảo hiểm y tế</option>
              </select>
            </div>
          </form>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePrevStep}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Quay lại
            </button>
            <button
              onClick={handleNextStep}
              disabled={!patientInfo.fullName || !patientInfo.phone}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Xác nhận thông tin</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Thông tin bác sĩ</h3>
            <p>{selectedDoctor?.name} - {selectedDoctor?.specialty}</p>
            <p>{selectedDoctor?.hospital}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Thời gian khám</h3>
            <p>{selectedDate?.toLocaleDateString()} - {selectedTime}</p>
            <p>Hình thức: {appointmentType === 'in-person' ? 'Trực tiếp' : appointmentType === 'online' ? 'Video' : 'Điện thoại'}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Thông tin bệnh nhân</h3>
            <p>Họ tên: {patientInfo.fullName}</p>
            <p>Ngày sinh: {patientInfo.dob}</p>
            <p>Giới tính: {patientInfo.gender === 'male' ? 'Nam' : 'Nữ'}</p>
            <p>Số điện thoại: {patientInfo.phone}</p>
            <p>Email: {patientInfo.email}</p>
            <p>Ghi chú: {patientInfo.note}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Phí khám</h3>
            <p>500.000 VNĐ</p>
            <p>Thanh toán: {paymentMethod === 'on-site' ? 'Tại chỗ' : paymentMethod === 'online' ? 'Online' : 'Bảo hiểm'}</p>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handlePrevStep}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Quay lại
            </button>
            <button
              onClick={handleConfirm}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Xác nhận đặt lịch
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;