// 📁 src/app/doctor/patients/components/PatientTable.tsx
'use client'

import PatientActions from './PatientActions'

const patients = [
  { id: 1, name: 'Nguyễn Văn A', gender: 'Nam', age: 30, code: 'BN1234' },
  { id: 2, name: 'Trần Thị B', gender: 'Nữ', age: 25, code: 'BN1235' },
  { id: 3, name: 'Lê Văn C', gender: 'Nam', age: 40, code: 'BN1236' },
]

export default function PatientTable() {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full table-auto">
        <thead className="bg-gray-100 text-left">
          <tr className="text-sm text-muted-foreground">
            <th className="px-4 py-3">Họ tên</th>
            <th className="px-4 py-3">Giới tính</th>
            <th className="px-4 py-3">Tuổi</th>
            <th className="px-4 py-3">Mã BN</th>
            <th className="px-4 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((pt) => (
            <tr key={pt.id} className="border-t text-sm">
              <td className="px-4 py-3 font-medium">{pt.name}</td>
              <td className="px-4 py-3">{pt.gender}</td>
              <td className="px-4 py-3">{pt.age}</td>
              <td className="px-4 py-3">{pt.code}</td>
              <td className="px-4 py-3 text-center">
                <PatientActions
                  onView={() => console.log(`Xem hồ sơ ${pt.name}`)}
                  onHistory={() => console.log(`Lịch sử khám ${pt.name}`)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
