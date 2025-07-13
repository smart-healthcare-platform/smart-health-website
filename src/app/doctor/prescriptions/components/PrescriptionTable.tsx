// 📁 src/app/doctor/prescriptions/components/PrescriptionTable.tsx
'use client'

import PrescriptionActions from './PrescriptionActions'

const prescriptions = [
  { id: 1, code: 'RX001', patient: 'Nguyễn Văn A', date: '12/07/2025', status: 'Đã gửi' },
  { id: 2, code: 'RX002', patient: 'Trần Thị B', date: '11/07/2025', status: 'Nháp' },
  { id: 3, code: 'RX003', patient: 'Lê Văn C', date: '10/07/2025', status: 'Đã gửi' },
]

export default function PrescriptionTable() {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full table-auto">
        <thead className="bg-gray-100 text-left">
          <tr className="text-sm text-muted-foreground">
            <th className="px-4 py-3">Mã đơn</th>
            <th className="px-4 py-3">Bệnh nhân</th>
            <th className="px-4 py-3">Ngày kê</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((rx) => (
            <tr key={rx.id} className="border-t text-sm">
              <td className="px-4 py-3 font-medium">{rx.code}</td>
              <td className="px-4 py-3">{rx.patient}</td>
              <td className="px-4 py-3">{rx.date}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    rx.status === 'Đã gửi'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {rx.status}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <PrescriptionActions
                  onView={() => console.log(`Xem ${rx.code}`)}
                  onSend={() => console.log(`Gửi ${rx.code}`)}
                  onPrint={() => console.log(`In ${rx.code}`)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
