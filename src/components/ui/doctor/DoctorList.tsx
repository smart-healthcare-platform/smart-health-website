'use client';
import DoctorCard from './DoctorCard';
import { useState, useEffect } from 'react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  image: string;
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}