// 📁 src/app/doctor/appointments/components/AppointmentTable.tsx
'use client'

import AppointmentActions from './AppointmentActions'

const appointments = [
    { id: 1, name: 'Nguyễn Văn A', time: '08:00', reason: 'Đau đầu', status: 'Đang chờ' },
    { id: 2, name: 'Trần Thị B', time: '09:00', reason: 'Khám định kỳ', status: 'Đã khám' },
    { id: 3, name: 'Lê Văn C', time: '10:30', reason: 'Khó thở', status: 'Hủy' },
]

export default function AppointmentTable() {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full table-auto">
                <thead className="bg-gray-100 text-left">
                    <tr className="text-sm text-muted-foreground">
                        <th className="px-4 py-3">Tên bệnh nhân</th>
                        <th className="px-4 py-3">Giờ hẹn</th>
                        <th className="px-4 py-3">Lý do khám</th>
                        <th className="px-4 py-3">Trạng thái</th>
                        <th className="px-4 py-3 text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appt) => (
                        <tr key={appt.id} className="border-t text-sm">
                            <td className="px-4 py-3 font-medium">{appt.name}</td>
                            <td className="px-4 py-3">{appt.time}</td>
                            <td className="px-4 py-3">{appt.reason}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${appt.status === 'Đã khám'
                                            ? 'bg-green-100 text-green-700'
                                            : appt.status === 'Hủy'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                >
                                    {appt.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center space-x-2">
                                <AppointmentActions
                                    onView={() => console.log(`Xem ${appt.name}`)}
                                    onComplete={() => console.log(`Đã khám ${appt.name}`)}
                                    onCancel={() => console.log(`Hủy ${appt.name}`)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
