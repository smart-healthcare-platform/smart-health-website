import { RecordCard } from "./record-card"
import type { Record } from "./record-card" 
const mockRecords: Record[] = [
  {
    id: "BA001",
    patientName: "Nguyễn Văn An",
    patientAge: 45,
    patientGender: "Nam",
    diagnosis: "Tăng huyết áp nguyên phát",
    examDate: "2024-01-15",
    status: "completed",
    specialty: "Tim mạch",
    symptoms: "Đau đầu, chóng mặt, mệt mỏi",
    treatment: "Thuốc hạ huyết áp, chế độ ăn ít muối",
    nextAppointment: "2024-02-15",
  },
  {
    id: "BA002",
    patientName: "Trần Thị Bình",
    patientAge: 32,
    patientGender: "Nữ",
    diagnosis: "Viêm dạ dày cấp",
    examDate: "2024-01-14",
    status: "follow-up",
    specialty: "Tiêu hóa",
    symptoms: "Đau bụng, buồn nôn, ợ hơi",
    treatment: "Thuốc kháng acid, kháng sinh",
    nextAppointment: "2024-01-28",
  },
  {
    id: "BA003",
    patientName: "Lê Minh Cường",
    patientAge: 28,
    patientGender: "Nam",
    diagnosis: "Gãy xương cẳng chân trái",
    examDate: "2024-01-13",
    status: "pending",
    specialty: "Chấn thương chỉnh hình",
    symptoms: "Đau, sưng, không thể di chuyển",
    treatment: "Phẫu thuật nẹp xương, bó bột",
    nextAppointment: "2024-02-13",
  },
  {
    id: "BA004",
    patientName: "Phạm Thị Dung",
    patientAge: 38,
    patientGender: "Nữ",
    diagnosis: "Đau nửa đầu mãn tính",
    examDate: "2024-01-12",
    status: "completed",
    specialty: "Thần kinh",
    symptoms: "Đau đầu một bên, nhạy cảm ánh sáng",
    treatment: "Thuốc giảm đau, thay đổi lối sống",
    nextAppointment: "2024-03-12",
  },
  {
    id: "BA005",
    patientName: "Hoàng Văn Em",
    patientAge: 8,
    patientGender: "Nam",
    diagnosis: "Viêm phổi do virus",
    examDate: "2024-01-11",
    status: "follow-up",
    specialty: "Nhi khoa",
    symptoms: "Ho, sốt, khó thở",
    treatment: "Thuốc kháng virus, hỗ trợ hô hấp",
    nextAppointment: "2024-01-25",
  },
]

export function RecordsList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Danh sách bệnh án ({mockRecords.length})</h2>
      </div>

      <div className="grid gap-4">
        {mockRecords.map((record) => (
          <RecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  )
}
