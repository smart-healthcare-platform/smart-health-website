"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/index"
import { setDate, setSlot } from "@/redux/slices/bookingSlice"
import Calendar from "../components/slot/Calendar"
import TimeSlotGrid from "../components/slot/TimeSlotGrid"
import { useEffect, useState } from "react"
import { doctorService } from "@/services/doctor.service"
import { TimeSlot } from "@/types/timeSlot"


export default function Step2() {
  const dispatch = useDispatch()
  const { doctor, date: dateStr, slot_id } = useSelector(
    (state: RootState) => state.booking
  )

  const [allSlots, setAllSlots] = useState<TimeSlot[]>([])
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const selectedDate = dateStr ? dateStr.split("T")[0] : null

  useEffect(() => {
    if (!doctor) return
    const fetchSlots = async () => {
      setLoadingSlots(true)
      try {
        const slots = await doctorService.getDoctorSlots(doctor.id)
        console.log(slots)
        setAllSlots(slots)
        setAvailableDates(Array.from(new Set(slots.map((s) => s.date))))

      } finally {
        setLoadingSlots(false)
      }
    }
    fetchSlots()
  }, [doctor])

  useEffect(() => {
    if (!dateStr) {
      setTimeSlots([])
      return
    }
    const slotsForDay = allSlots
      .filter((s) => s.date === dateStr.split("T")[0])
      .sort((a, b) => a.time.localeCompare(b.time))
    setTimeSlots(slotsForDay)
  }, [dateStr, allSlots])

  return (
    <div className="space-y-6">
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={(d) => dispatch(setDate(d))}
        availableDates={availableDates}
      />

      <TimeSlotGrid
        selectedSlotId={slot_id}
        onSlotSelect={(slot) => dispatch(setSlot(slot))}
        selectedDate={selectedDate}
        timeSlots={timeSlots}
        loading={loadingSlots}
      />
    </div>
  )
}
