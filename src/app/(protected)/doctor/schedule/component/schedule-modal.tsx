"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { WeeklyAvailability } from "@/types/doctor/doctor.type";
import { DayOfWeek } from "@/types/doctor/dto/create-weekly.dto";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: WeeklyAvailability) => void;
    initialData: WeeklyAvailability | null;
    existingDays: DayOfWeek[];
}

const DAY_LABELS: Record<DayOfWeek, string> = {
    MON: "Thứ 2",
    TUE: "Thứ 3",
    WED: "Thứ 4",
    THU: "Thứ 5",
    FRI: "Thứ 6",
    SAT: "Thứ 7",
    SUN: "Chủ nhật",
};

export function ScheduleModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    existingDays,
}: Props) {
    const [selectedDay, setSelectedDay] = useState<DayOfWeek | "">("");
    const [startTime, setStartTime] = useState("08:00");
    const [endTime, setEndTime] = useState("12:00");
    const isValid = selectedDay && startTime && endTime;
    const formatTime = (t: string) => t.substring(0, 5);

    useEffect(() => {
        if (initialData) {
            setSelectedDay(initialData.day_of_week);
            setStartTime(formatTime(initialData.start_time));
            setEndTime(formatTime(initialData.end_time));
        } else {
            setSelectedDay("");
            setStartTime("08:00");
            setEndTime("12:00");
        }
    }, [initialData, isOpen]);

    const handleSave = () => {
        if (!selectedDay) return;

        onSave({
            id: initialData?.id ?? "",
            day_of_week: selectedDay,
            start_time: startTime,
            end_time: endTime,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Chỉnh sửa" : "Thêm mới"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">

                    {/* DAY SELECT */}
                    <div>
                        <label>Ngày</label>
                        <Select
                            value={selectedDay}
                            onValueChange={v => setSelectedDay(v as DayOfWeek)}
                            disabled={!!initialData}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn ngày" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(DAY_LABELS).map((d) => (
                                    <SelectItem
                                        key={d}
                                        value={d}
                                        disabled={!initialData && existingDays.includes(d as DayOfWeek)}
                                    >
                                        {DAY_LABELS[d as DayOfWeek]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* START */}
                    <div>
                        <label>Giờ bắt đầu</label>
                        <Select value={startTime} onValueChange={setStartTime}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="08:00">08:00</SelectItem>
                                <SelectItem value="13:00">13:00</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* END */}
                    <div>
                        <label>Giờ kết thúc</label>
                        <Select value={endTime} onValueChange={setEndTime}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12:00">12:00</SelectItem>
                                <SelectItem value="17:00">17:00</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button
                        disabled={!isValid}
                        className="bg-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSave}
                    >
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
