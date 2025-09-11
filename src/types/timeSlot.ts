// types/TimeSlot.ts
export type TimeSlotStatus = "available" | "booked" | "off" | "expired";

export interface TimeSlot {
  date: string      // yyyy-mm-dd
  time: string      // HH:mm
  status: TimeSlotStatus
}

