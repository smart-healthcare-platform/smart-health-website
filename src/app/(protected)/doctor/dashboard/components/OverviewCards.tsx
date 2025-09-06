// 📁 src/app/doctor/dashboard/components/OverviewCards.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CalendarCheck, UserPlus, CheckCircle, XCircle } from 'lucide-react'

const data = [
  { icon: CalendarCheck, label: 'Ca khám hôm nay', value: 5 },
  { icon: UserPlus, label: 'Bệnh nhân mới', value: 2 },
  { icon: CheckCircle, label: 'Đã hoàn tất', value: 3 },
  { icon: XCircle, label: 'Đã hủy', value: 1 },
]

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, idx) => (
        <Card
          key={idx}
          className="bg-gradient-to-br from-indigo-50 to-white hover:from-indigo-100 transition-all duration-300 flex flex-col items-center p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3 mb-4">
            <item.icon className="w-10 h-10 text-indigo-600" />
            <p className="text-sm font-medium text-gray-600">{item.label}</p>
          </div>
          <CardContent className="p-0 flex-1 flex items-center justify-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-800">{item.value}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}