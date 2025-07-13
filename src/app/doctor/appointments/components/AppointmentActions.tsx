// 📁 src/app/doctor/appointments/components/AppointmentActions.tsx
'use client'

import { Button } from '@/components/ui/button'

export default function AppointmentActions({
  onView,
  onComplete,
  onCancel,
}: {
  onView: () => void
  onComplete: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-x-2 text-center">
      <Button variant="outline" size="sm" onClick={onView}>
        Chi tiết
      </Button>
      <Button variant="default" size="sm" onClick={onComplete}>
        Đã khám
      </Button>
      <Button variant="destructive" size="sm" onClick={onCancel}>
        Hủy
      </Button>
    </div>
  )
}
