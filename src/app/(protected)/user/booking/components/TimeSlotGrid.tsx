import React from "react";

export type TimeSlotStatus = "available" | "booked" | "off" | "expired";

export interface TimeSlot {
  time: string;
  status: TimeSlotStatus;
}

interface TimeSlotGridProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  selectedDate: Date | null;
  timeSlots: TimeSlot[];
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedTime,
  onTimeSelect,
  selectedDate,
  timeSlots,
}) => {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Chọn giờ khám</h3>

      {!selectedDate && (
        <p className="text-gray-500 text-sm mb-4">Vui lòng chọn ngày trước</p>
      )}

      <div className="grid grid-cols-4 gap-3">
        {timeSlots.map((slot) => {
          const isDisabled =
            !selectedDate || slot.status !== "available";

          return (
            <button
              key={slot.time}
              onClick={() => onTimeSelect(slot.time)}
              disabled={isDisabled}
              className={`p-3 text-sm font-medium rounded-lg transition-colors ${
                slot.status === "available"
                  ? selectedTime === slot.time
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 border"
                  : slot.status === "booked"
                  ? "bg-red-100 text-red-400 cursor-not-allowed"
                  : slot.status === "off"
                  ? "bg-yellow-100 text-yellow-600 cursor-not-allowed"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotGrid;
