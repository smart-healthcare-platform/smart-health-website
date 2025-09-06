// 📁 src/app/doctor/schedule/components/ScheduleModal.tsx
'use client'

export function Modal({ event, onClose }: { event: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[400px]">
        <h2 className="text-xl font-bold mb-2">Chi tiết sự kiện</h2>
        <p className="mb-1"><strong>Tiêu đề:</strong> {event.title}</p>
        <p className="mb-1">
          <strong>Thời gian:</strong>{' '}
          {event.start.toLocaleTimeString()} - {event.end.toLocaleTimeString()}
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}

export function ScheduleDetailModal({ date, onClose }: { date: Date; onClose: () => void }) {
  // Hourly slots from 8:00 AM to 5:00 PM
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const slotTime = new Date(date);
    slotTime.setHours(8 + i, 0, 0, 0);
    return {
      time: slotTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: Math.random() > 0.3 ? 'available' : 'booked',
      patient: Math.random() > 0.3 ? 'Khám bệnh - Nguyễn Văn A' : null,
    };
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Lịch hẹn - {date.toLocaleDateString('vi-VN')}</h2>
        <div className="space-y-2">
          {timeSlots.map((slot, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg flex items-center justify-between ${
                slot.status === 'booked' ? 'bg-amber-100' : 'bg-emerald-100'
              }`}
            >
              <span className="font-medium text-gray-800">{slot.time}</span>
              {slot.patient ? (
                <span className="text-sm text-gray-600 truncate">{slot.patient}</span>
              ) : (
                <span className="text-sm text-gray-500">Trống</span>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}