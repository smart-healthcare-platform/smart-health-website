// app/booking/components/DoctorFilter.tsx
'use client';
import { useState } from 'react';
import DoctorCard from '@/components/ui/doctor/DoctorCard';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  image: string;
}

interface DoctorFilterProps {
  doctors: Doctor[];
}

export default function DoctorFilter({ doctors }: DoctorFilterProps) {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  const specialties = Array.from(new Set(doctors.map((doctor) => doctor.specialty)));

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()) &&
      (specialty === '' || doctor.specialty === specialty)
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Tìm kiếm bác sĩ</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nhập tên bác sĩ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả chuyên khoa</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>
      <div className="mt-6 max-h-64 overflow-y-auto">
        {filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}