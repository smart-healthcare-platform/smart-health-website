'use client';
import { useState, useEffect } from 'react';

interface DoctorFilterProps {
  specialties: string[];
  onSearchChange: (search: string) => void;
  onSpecialtyChange: (specialty: string) => void;
}

export default function DoctorFilter({ specialties, onSearchChange, onSpecialtyChange }: DoctorFilterProps) {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    onSearchChange(search);
  }, [search, onSearchChange]);

  useEffect(() => {
    onSpecialtyChange(specialty);
  }, [specialty, onSpecialtyChange]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Bộ lọc</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
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