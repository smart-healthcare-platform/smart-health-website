import DoctorCard from "@/components/ui/doctor/DoctorCard";

const doctors = [
    {
        id: 1,
        name: "BS. Nguyễn Văn A",
        specialty: "Nội tổng quát",
        hospital: "Bệnh viện Chợ Rẫy",
        image: "https://i.pravatar.cc/100?img=1",
    },
    {
        id: 2,
        name: "BS. Trần Thị B",
        specialty: "Nhi khoa",
        hospital: "BV Nhi Đồng 1",
        image: "https://i.pravatar.cc/100?img=2",
    },
    {
        id: 3,
        name: "BS. Lê Văn C",
        specialty: "Tim mạch",
        hospital: "BV Tim Tâm Đức",
        image: "https://i.pravatar.cc/100?img=3",
    },
];

export function DoctorList() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
        </div>
    );
}
