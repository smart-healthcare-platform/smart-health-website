'use client';
import { useState, useEffect } from 'react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  image: string;
}

export default function DoctorFilter() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    // Dữ liệu mẫu (có thể thay bằng API)
    const dummyDoctors = [
      {
        id: 1,
        name: 'BS. Nguyễn Văn A',
        specialty: 'Nội khoa',
        hospital: 'Bệnh viện Chợ Rẫy',
        image: 'https://i.pravatar.cc/150?img=1',
      },
      {
        id: 2,
        name: 'BS. Trần Thị B',
        specialty: 'Nhi khoa',
        hospital: 'BV Nhi Đồng 1',
        image: 'https://i.pravatar.cc/150?img=2',
      },
      {
        id: 3,
        name: 'BS. Lê Văn C',
        specialty: 'Tim mạch',
        hospital: 'BV Tim Tâm Đức',
        image: 'https://i.pravatar.cc/150?img=3',
      },
      {
        id: 4,
        name: 'BS. Phạm Thị D',
        specialty: 'Da liễu',
        hospital: 'BV Da Liễu TP.HCM',
        image: 'https://i.pravatar.cc/150?img=4',
      },
    ];
    setDoctors(dummyDoctors);
  }, []);

  useEffect(() => {
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()) &&
      (specialty === '' || doctor.specialty === specialty)
    );
    setFilteredDoctors(filtered);
  }, [search, specialty, doctors]);

  const specialties = Array.from(new Set(doctors.map((doctor) => doctor.specialty)));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Bộ lọc</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tìm kiếm theo tên</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tên bác sĩ..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả chuyên khoa</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}