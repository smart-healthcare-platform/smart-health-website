// 📁 src/app/doctor/dashboard/components/StatsChart.tsx
'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const chartData = [
  { name: 'T1', completed: 5 },
  { name: 'T2', completed: 8 },
  { name: 'T3', completed: 6 },
  { name: 'T4', completed: 9 },
  { name: 'T5', completed: 7 },
]

export default function StatsChart() {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg h-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Thống kê ca khám (tháng)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis allowDecimals={false} stroke="#666" />
          <Tooltip contentStyle={{ background: '#fff', borderRadius: '8px' }} />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#colorUv)"
            dot={{ r: 6, fill: '#3b82f6' }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}