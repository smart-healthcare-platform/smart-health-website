'use client';
import { Search, Filter, X } from 'lucide-react';

interface DoctorFilterProps {
  onSearchChange: (search: string) => void;
  searchValue: string;
  isSearching: boolean;
}

export default function DoctorFilter({ onSearchChange, searchValue, isSearching }: DoctorFilterProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const clearFilters = () => {
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">Tìm kiếm bác sĩ</h2>
        </div>

        {searchValue && (
          <button
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1 text-sm hover:bg-gray-100 px-2 py-1 rounded-lg"
          >
            <X className="w-4 h-4" />
            <span>Xóa</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${
            isSearching ? 'text-emerald-500' : 'text-gray-400'
          }`}
        />
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          className={`w-full pl-12 pr-12 py-4 border rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 
                     focus:border-transparent transition-all 
                     text-gray-900 placeholder-gray-500 bg-white ${
                       isSearching
                         ? 'border-emerald-300 ring-1 ring-emerald-200'
                         : 'border-gray-200'
                     }`}
          placeholder={isSearching ? 'Đang tìm kiếm...' : 'Nhập tên bác sĩ...'}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
