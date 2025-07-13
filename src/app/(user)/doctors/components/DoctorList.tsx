'use client';
import DoctorCard from './DoctorCard';
import { useState, useEffect } from 'react';
import DoctorFilter from './DoctorFilter';
import { useRouter } from 'next/navigation';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  image: string;
}

export default function DoctorList() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  useEffect(() => {
    const dummyDoctors = [
      { id: 1, name: 'BS. Nguyễn Văn A', specialty: 'Nội khoa', hospital: 'Bệnh viện Chợ Rẫy', image: 'https://randomuser.me/api/portraits/women/49.jpg' },
      { id: 2, name: 'BS. Trần Thị B', specialty: 'Nhi khoa', hospital: 'BV Nhi Đồng 1', image: 'https://randomuser.me/api/portraits/women/48.jpg' },
      { id: 3, name: 'BS. Lê Văn C', specialty: 'Tim mạch', hospital: 'BV Tim Tâm Đức', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: 4, name: 'BS. Phạm Thị D', specialty: 'Da liễu', hospital: 'BV Da Liễu TP.HCM', image: 'https://randomuser.me/api/portraits/women/40.jpg' },
      { id: 5, name: 'BS. Hoàng Văn E', specialty: 'Chấn thương', hospital: 'BV Chấn Thương Chỉnh Hình', image: 'https://randomuser.me/api/portraits/women/45.jpg' },
      { id: 6, name: 'BS. Lê Thị F', specialty: 'Tai mũi họng', hospital: 'BV Tai Mũi Họng', image: 'https://randomuser.me/api/portraits/women/50.jpg' },
      { id: 7, name: 'BS. Trần Văn G', specialty: 'Nhãn khoa', hospital: 'BV Mắt TP.HCM', image: 'https://randomuser.me/api/portraits/women/46.jpg' },
      { id: 8, name: 'BS. Nguyễn Thị H', specialty: 'Răng hàm mặt', hospital: 'BV Răng Hàm Mặt', image: 'https://randomuser.me/api/portraits/women/47.jpg' },
    ];
    setDoctors(dummyDoctors);
  }, []);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()) &&
      (specialty === '' || doctor.specialty === specialty)
  );

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty)));

  const handleBook = (doctor: Doctor) => {
    // Chuyển hướng với query params
    router.push(`/booking?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}&specialty=${encodeURIComponent(doctor.specialty)}&hospital=${encodeURIComponent(doctor.hospital)}&image=${encodeURIComponent(doctor.image)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Đội Ngũ Bác Sĩ</h1>
        <DoctorFilter
          specialties={specialties}
          onSearchChange={setSearch}
          onSpecialtyChange={setSpecialty}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {currentDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onBook={handleBook} />
          ))}
        </div>
        {filteredDoctors.length > doctorsPerPage && (
          <div className="flex justify-center items-center mt-10 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-full ${currentPage === page
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}