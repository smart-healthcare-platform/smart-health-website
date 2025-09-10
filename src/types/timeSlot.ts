// types/TimeSlot.ts
export type TimeSlotStatus = "available" | "booked" | "off" | "expired";

export interface TimeSlot {
  time: string; // "HH:MM"
  status: TimeSlotStatus;
}
