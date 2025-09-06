import React from 'react';
import { User, Check } from 'lucide-react';
import { Doctor } from '@/types';

interface DoctorCardProps {
  doctor: Doctor;
  isSelected: boolean;
  onSelect: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isSelected, onSelect }) => {
  return (
    <div 
      className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
      }`}
      onClick={() => onSelect(doctor)}
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
          <p className="text-emerald-600 text-sm font-medium">{doctor.specialty}</p>
          <p className="text-gray-500 text-xs">{doctor.experience}</p>
          <div className="flex items-center mt-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">{doctor.price.toLocaleString()}đ</p>
          {isSelected && (
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-2 ml-auto">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
