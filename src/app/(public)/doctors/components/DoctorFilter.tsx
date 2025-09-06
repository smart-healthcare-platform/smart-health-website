'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface DoctorFilterProps {
  specialties: string[];
  onSearchChange: (search: string) => void;
  onSpecialtyChange: (specialty: string) => void;
}

export default function DoctorFilter({ specialties, onSearchChange, onSpecialtyChange }: DoctorFilterProps) {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    onSearchChange(search);
  }, [search, onSearchChange]);

  useEffect(() => {
    onSpecialtyChange(specialty);
  }, [specialty, onSpecialtyChange]);

  const clearFilters = () => {
    setSearch('');
    setSpecialty('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">Tìm kiếm bác sĩ</h2>
        </div>
        
        {(search || specialty) && (
          <button
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1 text-sm"
          >
            <X className="w-4 h-4" />
            <span>Xóa bộ lọc</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
            placeholder="Tìm kiếm theo tên bác sĩ..."
          />
        </div>

        {/* Specialty Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setSpecialty('')}
            className={`px-4 py-3 rounded-xl font-medium transition-all text-sm ${
              specialty === ''
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
            }`}
          >
            Tất cả chuyên khoa
          </button>
          
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSpecialty(spec)}
              className={`px-4 py-3 rounded-xl font-medium transition-all text-sm ${
                specialty === spec
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

