// 📁 src/app/doctor/schedule/components/CalendarView.tsx
'use client'

import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import vi from 'date-fns/locale/vi'
import { useState } from 'react'
import { Modal, ScheduleDetailModal } from './ScheduleModal'

const locales = {
  vi: vi,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

// Fake data event with only appointments
const events: Event[] = [
  {
    title: 'Khám bệnh - Nguyễn Văn A',
    start: new Date(2025, 6, 13, 9, 0), // Today: July 13, 2025, 9:00 AM
    end: new Date(2025, 6, 13, 10, 0), // 10:00 AM
    resource: { type: 'appointment', color: '#FCD34D' },
  },
  {
    title: 'Khám bệnh - Trần Thị B',
    start: new Date(2025, 6, 13, 14, 0), // 2:00 PM
    end: new Date(2025, 6, 13, 15, 0), // 3:00 PM
    resource: { type: 'appointment', color: '#FCD34D' },
  },
]

export default function CalendarView() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedDate(slotInfo.start)
  }

  const eventPropGetter = (event: Event) => {
    const backgroundColor = event.resource?.color || '#FCD34D'
    return { style: { backgroundColor, borderRadius: '4px', padding: '2px' } }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectEvent={(event) => setSelectedEvent(event)}
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventPropGetter}
        defaultView="day"
        views={['day', 'week', 'month']}
        min={new Date(2025, 6, 13, 8, 0)} // Start at 8:00 AM
        max={new Date(2025, 6, 13, 17, 0)} // End at 5:00 PM
        step={60} // 1-hour intervals
        timeslots={1} // One slot per hour
        messages={{
          next: '→',
          previous: '←',
          today: 'Hôm nay',
          month: 'Tháng',
          week: 'Tuần',
          day: 'Ngày',
          agenda: 'Danh sách',
        }}
        popup
      />
      {selectedEvent && (
        <Modal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
      {selectedDate && (
        <ScheduleDetailModal date={selectedDate} onClose={() => setSelectedDate(null)} />
      )}
    </div>
  )
}