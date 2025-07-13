// 📁 src/app/doctor/patients/components/PatientActions.tsx
'use client'

import { Button } from '@/components/ui/button'

export default function PatientActions({
  onView,
  onHistory,
}: {
  onView: () => void
  onHistory: () => void
}) {
  return (
    <div className="space-x-2 text-center">
      <Button variant="outline" size="sm" onClick={onView}>
        Hồ sơ
      </Button>
      <Button variant="default" size="sm" onClick={onHistory}>
        Lịch sử khám
      </Button>
    </div>
  )
}
