'use client';
import DoctorCard from './DoctorCard';
import DoctorFilter from './DoctorFilter';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, Filter, ChevronLeft, ChevronRight, Stethoscope, MapPin, Star } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  image: string;
  experience?: number;
  rating?: number;
  patients?: number;
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
      { 
        id: 1, 
        name: 'BS. Nguyễn Văn Minh', 
        specialty: 'Tim mạch', 
        hospital: 'Bệnh viện Tim Tâm Đức', 
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        experience: 15,
        rating: 4.9,
        patients: 2500
      },
      { 
        id: 2, 
        name: 'BS. Trần Thị Hoa', 
        specialty: 'Nhi khoa', 
        hospital: 'BV Nhi Đồng 1', 
        image: 'https://randomuser.me/api/portraits/women/48.jpg',
        experience: 12,
        rating: 4.8,
        patients: 1800
      },
      { 
        id: 3, 
        name: 'BS. Lê Hoàng Nam', 
        specialty: 'Nội khoa', 
        hospital: 'Bệnh viện Chợ Rẫy', 
        image: 'https://randomuser.me/api/portraits/men/25.jpg',
        experience: 18,
        rating: 4.7,
        patients: 3200
      },
      { 
        id: 4, 
        name: 'BS. Phạm Thị Lan', 
        specialty: 'Da liễu', 
        hospital: 'BV Da Liễu TP.HCM', 
        image: 'https://randomuser.me/api/portraits/women/40.jpg',
        experience: 10,
        rating: 4.6,
        patients: 1500
      },
      { 
        id: 5, 
        name: 'BS. Hoàng Văn Đức', 
        specialty: 'Chấn thương Chỉnh hình', 
        hospital: 'BV Chấn Thương Chỉnh Hình', 
        image: 'https://randomuser.me/api/portraits/men/45.jpg',
        experience: 20,
        rating: 4.9,
        patients: 2800
      },
      { 
        id: 6, 
        name: 'BS. Lê Thị Mai', 
        specialty: 'Tai mũi họng', 
        hospital: 'BV Tai Mũi Họng', 
        image: 'https://randomuser.me/api/portraits/women/50.jpg',
        experience: 14,
        rating: 4.5,
        patients: 1200
      },
      { 
        id: 7, 
        name: 'BS. Trần Văn Khoa', 
        specialty: 'Nhãn khoa', 
        hospital: 'BV Mắt TP.HCM', 
        image: 'https://randomuser.me/api/portraits/men/38.jpg',
        experience: 16,
        rating: 4.8,
        patients: 2100
      },
      { 
        id: 8, 
        name: 'BS. Nguyễn Thị Thu', 
        specialty: 'Răng hàm mặt', 
        hospital: 'BV Răng Hàm Mặt', 
        image: 'https://randomuser.me/api/portraits/women/47.jpg',
        experience: 11,
        rating: 4.7,
        patients: 1600
      },
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
    router.push(`/booking?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}&specialty=${encodeURIComponent(doctor.specialty)}&hospital=${encodeURIComponent(doctor.hospital)}&image=${encodeURIComponent(doctor.image)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 py-24">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <Stethoscope className="w-4 h-4 mr-2" />
            Đội ngũ y bác sĩ
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Bác sĩ chuyên khoa
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> hàng đầu</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hơn 50 bác sĩ giàu kinh nghiệm, được đào tạo bài bản, sẵn sàng tư vấn và chăm sóc sức khỏe cho bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
            <div className="text-gray-600">Bác sĩ chuyên khoa</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">4.8</div>
            <div className="text-gray-600">Đánh giá trung bình</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
            <div className="text-gray-600">Bệnh viện liên kết</div>
          </div>
        </div>

        {/* Filter */}
        <DoctorFilter
          specialties={specialties}
          onSearchChange={setSearch}
          onSpecialtyChange={setSpecialty}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <Filter className="w-5 h-5" />
            <span>Hiển thị {currentDoctors.length} trong số {filteredDoctors.length} bác sĩ</span>
          </div>
          {(search || specialty) && (
            <button 
              onClick={() => {
                setSearch('');
                setSpecialty('');
                setCurrentPage(1);
              }}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {currentDoctors.map((doctor, index) => (
            <div key={doctor.id} 
                 className="transform transition-all duration-300 hover:-translate-y-1"
                 style={{ animationDelay: `${index * 100}ms` }}>
              <DoctorCard doctor={doctor} onBook={handleBook} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bác sĩ</h3>
            <p className="text-gray-600 mb-6">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
            <button 
              onClick={() => {
                setSearch('');
                setSpecialty('');
                setCurrentPage(1);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredDoctors.length > doctorsPerPage && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}