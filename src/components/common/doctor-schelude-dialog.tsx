"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { doctorService } from "@/services/doctor.service";
import { WeeklyAvailability } from "@/types/doctor/doctor.type";
import { DayOfWeek, WeeklyAvailabilityDto } from "@/types/doctor/dto/create-weekly.dto";
import { CalendarDays, Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface DoctorScheduleDialogProps {
    open: boolean;
    onClose: () => void;
    doctorName: string;
    doctorId: string;
}

const DAY_ORDER: DayOfWeek[] = [
    DayOfWeek.MON, DayOfWeek.TUE, DayOfWeek.WED, DayOfWeek.THU,
    DayOfWeek.FRI, DayOfWeek.SAT, DayOfWeek.SUN
];

const DAY_LABELS: Record<DayOfWeek, string> = {
    MON: "Thứ 2",
    TUE: "Thứ 3",
    WED: "Thứ 4",
    THU: "Thứ 5",
    FRI: "Thứ 6",
    SAT: "Thứ 7",
    SUN: "Chủ nhật",
};

const START_OPTIONS = ["08:00", "13:00"];
const END_OPTIONS = ["12:00", "17:00"];

export default function DoctorScheduleDialog({
    open,
    onClose,
    doctorName,
    doctorId,
}: DoctorScheduleDialogProps) {
    const [schedules, setSchedules] = useState<WeeklyAvailability[]>([]);
    const [loading, setLoading] = useState(false);

    // --- Edit state ---
    const [editOpen, setEditOpen] = useState(false);
    const [editItem, setEditItem] = useState<WeeklyAvailability | null>(null);
    const [editStart, setEditStart] = useState(START_OPTIONS[0]);
    const [editEnd, setEditEnd] = useState(END_OPTIONS[0]);

    // --- Add state ---
    const [addOpen, setAddOpen] = useState(false);
    const [newDay, setNewDay] = useState<DayOfWeek | "">("");
    const [newStart, setNewStart] = useState(START_OPTIONS[0]);
    const [newEnd, setNewEnd] = useState(END_OPTIONS[0]);

    const fetchSchedules = async () => {
        setLoading(true);
        const res = await doctorService.getWeeklySchedule(doctorId);
        const sorted = (res || []).sort(
            (a, b) => DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week)
        );
        setSchedules(sorted);
        setLoading(false);
    };

    useEffect(() => {
        if (open) fetchSchedules();
    }, [open, doctorId]);

    const handleEdit = (item: WeeklyAvailability) => {
        setEditItem(item);
        setEditStart(item.start_time);
        setEditEnd(item.end_time);
        setEditOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editItem) return;

        const updatedWeekly: WeeklyAvailabilityDto[] = schedules.map((s) =>
            s.id === editItem.id
                ? { day_of_week: s.day_of_week, start_time: editStart, end_time: editEnd }
                : { day_of_week: s.day_of_week, start_time: s.start_time, end_time: s.end_time }
        );

        const res = await doctorService.createOrUpdateWeeklyAvailability(doctorId, updatedWeekly);
        if (res) {
            await fetchSchedules();
            setEditOpen(false);
        }
    };

    const handleAdd = async () => {
        if (!newDay) return;

        const updatedWeekly: WeeklyAvailabilityDto[] = [
            ...schedules.map(s => ({ day_of_week: s.day_of_week, start_time: s.start_time, end_time: s.end_time })),
            { day_of_week: newDay, start_time: newStart, end_time: newEnd },
        ];

        const res = await doctorService.createOrUpdateWeeklyAvailability(doctorId, updatedWeekly);
        if (res) {
            await fetchSchedules();
            setAddOpen(false);
            setNewDay("");
            setNewStart(START_OPTIONS[0]);
            setNewEnd(END_OPTIONS[0]);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            // const res = await doctorService.deleteWeeklyAvailability(doctorId, id);
            // if (res) {
            //     setSchedules(prev => prev.filter(s => s.id !== id));
            // }
        } catch (error) {
            console.error("Error deleting weekly availability:", error);
        }
    };


    const availableDays = DAY_ORDER.filter(d => !schedules.some(s => s.day_of_week === d));

    return (
        <>
            {/* MAIN DIALOG */}
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-lg w-full p-0 overflow-hidden">
                    <div className="p-5">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                <CalendarDays className="w-5 h-5 text-primary" />
                                Lịch làm việc của {doctorName}
                            </DialogTitle>
                        </DialogHeader>

                        <Separator className="my-4" />

                        {loading ? (
                            <p className="text-center text-muted-foreground py-6">Đang tải...</p>
                        ) : (
                            <>
                                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                                    {schedules.map(item => (
                                        <div key={item.id} className="border bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{DAY_LABELS[item.day_of_week]}</p>
                                                <p className="text-sm text-muted-foreground">{item.start_time} - {item.end_time}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-2 rounded-md hover:bg-muted">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-md hover:bg-red-100">
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                </div>

                                {availableDays.length > 0 && (
                                    <div className="mt-4">
                                        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-md bg-black text-white hover:opacity-90">
                                            <Plus className="w-4 h-4" /> Thêm lịch
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        <Separator className="my-4" />

                        <div className="flex justify-end">
                            <button onClick={onClose} className="px-4 py-2 rounded-md border hover:bg-muted transition">
                                Đóng
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* EDIT DIALOG */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa: {editItem ? DAY_LABELS[editItem.day_of_week] : ""}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-3">
                        <div>
                            <label className="text-sm">Giờ bắt đầu</label>
                            <select value={editStart} onChange={(e) => setEditStart(e.target.value)} className="w-full border rounded-md mt-1 p-2">
                                {START_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm">Giờ kết thúc</label>
                            <select value={editEnd} onChange={(e) => setEditEnd(e.target.value)} className="w-full border rounded-md mt-1 p-2">
                                {END_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-5">
                        <button onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-md border hover:bg-muted">Hủy</button>
                        <button onClick={handleSaveEdit} className="px-4 py-2 rounded-md bg-primary text-white hover:opacity-90">Lưu</button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ADD DIALOG */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Thêm lịch làm việc mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-3">
                        <div>
                            <label className="text-sm">Chọn ngày</label>
                            <select value={newDay} onChange={(e) => setNewDay(e.target.value as DayOfWeek)} className="w-full border rounded-md mt-1 p-2">
                                <option value="">-- Chọn ngày --</option>
                                {availableDays.map(day => <option key={day} value={day}>{DAY_LABELS[day]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm">Giờ bắt đầu</label>
                            <select value={newStart} onChange={(e) => setNewStart(e.target.value)} className="w-full border rounded-md mt-1 p-2">
                                {START_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm">Giờ kết thúc</label>
                            <select value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className="w-full border rounded-md mt-1 p-2">
                                {END_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-5">
                        <button onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-md border hover:bg-muted">Hủy</button>
                        <button onClick={handleAdd} className="px-4 py-2 rounded-md bg-green-500 text-white hover:opacity-90">Thêm</button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
