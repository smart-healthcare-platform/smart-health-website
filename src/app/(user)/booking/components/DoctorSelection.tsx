'use client';
import { FC, useState } from 'react';
import { Doctor } from './types';

interface DoctorSelectionProps {
  onSelectDoctor: (doctor: Doctor) => void;
}

const doctors: Doctor[] = [
  { id: 1, name: 'BS. Nguyễn Văn A', specialty: 'Nội khoa', hospital: 'Bệnh viện A', image: '/doctor1.jpg' },
  { id: 2, name: 'BS. Trần Thị B', specialty: 'Nhi khoa', hospital: 'Bệnh viện B', image: '/doctor2.jpg' },
];

const specialties = ['Tất cả', 'Nội khoa', 'Nhi khoa', 'Tim mạch'];

const DoctorSelection: FC<DoctorSelectionProps> = ({ onSelectDoctor }) => {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('Tất cả');

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()) &&
      (specialty === 'Tất cả' || doctor.specialty === specialty)
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Chọn bác sĩ</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm bác sĩ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          {specialties.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-2xl hover:bg-gray-50 transition-all cursor-pointer"
            onClick={() => onSelectDoctor(doctor)}
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-blue-200"
            />
            <h3 className="text-lg font-medium text-gray-800 text-center">{doctor.name}</h3>
            <p className="text-sm text-gray-600 text-center">{doctor.specialty}</p>
            <p className="text-sm text-gray-500 text-center">{doctor.hospital}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSelection;