// 📁 src/app/doctor/prescriptions/components/PrescriptionActions.tsx
'use client'

import { Button } from '@/components/ui/button'

export default function PrescriptionActions({
  onView,
  onSend,
  onPrint,
}: {
  onView: () => void
  onSend: () => void
  onPrint: () => void
}) {
  return (
    <div className="space-x-2 text-center">
      <Button variant="outline" size="sm" onClick={onView}>
        Xem
      </Button>
      <Button variant="default" size="sm" onClick={onSend}>
        Gửi
      </Button>
      <Button variant="secondary" size="sm" onClick={onPrint}>
        In
      </Button>
    </div>
  )
}
