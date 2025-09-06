// 📁 src/app/doctor/dashboard/components/TodaySchedule.tsx
'use client'

const todayAppointments = [
  { time: '08:00', patient: 'Nguyễn Văn A', status: 'Chờ khám' },
  { time: '09:00', patient: 'Trần Thị B', status: 'Đã khám' },
  { time: '10:00', patient: 'Lê Văn C', status: 'Hủy' },
]

export default function TodaySchedule() {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Lịch khám hôm nay</h2>
      <ul className="space-y-4">
        {todayAppointments.map((item, idx) => (
          <li
            key={idx}
            className="border border-gray-100 p-4 rounded-xl flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
          >
            <div>
              <p className="font-semibold text-gray-900">{item.patient}</p>
              <p className="text-sm text-gray-500">{item.time}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                item.status === 'Đã khám'
                  ? 'bg-green-100 text-green-700'
                  : item.status === 'Hủy'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}