import React from 'react';
import { Doctor } from '@/types';
import DoctorCard from './DoctorCard';

interface DoctorSelectionProps {
  selectedDoctor: Doctor | null;
  onDoctorSelect: (doctor: Doctor) => void;
  selectedSpecialty: string;
  onSpecialtyChange: (specialty: string) => void;
  doctors: Doctor[];
  specialties: string[];
}

const DoctorSelection: React.FC<DoctorSelectionProps> = ({
  selectedDoctor,
  onDoctorSelect,
  selectedSpecialty,
  onSpecialtyChange,
  doctors,
  specialties
}) => {
  const filteredDoctors = selectedSpecialty === "Tất cả chuyên khoa" 
    ? doctors 
    : doctors.filter(doctor => doctor.specialty === selectedSpecialty);

  return (
    <div className="space-y-6">
      {/* Specialty Filter */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Chuyên khoa</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {specialties.map(specialty => (
            <button
              key={specialty}
              onClick={() => onSpecialtyChange(specialty)}
              className={`p-3 text-sm font-medium rounded-lg transition-colors text-left ${
                selectedSpecialty === specialty
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor List */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Chọn bác sĩ ({filteredDoctors.length} bác sĩ)
        </h3>
        <div className="space-y-4">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              isSelected={selectedDoctor?.id === doctor.id}
              onSelect={onDoctorSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorSelection;