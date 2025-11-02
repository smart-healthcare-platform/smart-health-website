export type TimeSlotStatus = "available" | "booked" | "off" | "expired";

export interface TimeSlot {
  id: string
  startTime: string
  date: string
  time: string
  status: TimeSlotStatus
}
