interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  image: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 hover:bg-gray-50 transition-all duration-300 border border-gray-100">
      <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
      <div className="flex-1">
        <h4 className="text-md font-medium text-gray-900">{doctor.name}</h4>
        <p className="text-xs text-gray-600">{doctor.specialty}</p>
        <p className="text-xs text-gray-500">{doctor.hospital}</p>
        <button className="mt-1 text-blue-500 hover:text-blue-700 text-xs">Chọn bác sĩ</button>
      </div>
    </div>
  );
}