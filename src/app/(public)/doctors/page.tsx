import { Suspense } from "react";
import DoctorList from "@/app/(public)/doctors/components/DoctorList";

export default function Doctors() {
  return (
    <Suspense fallback={<div>Đang tải danh sách bác sĩ...</div>}>
      <DoctorList />
    </Suspense>
  );
}
