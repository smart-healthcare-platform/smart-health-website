import { DoctorSchedule } from "./component/doctor-schedule"
// import { Header } from "@/components/header"

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* <Header /> */}
            <main className="p-6">
                <DoctorSchedule />
            </main>
        </div>
    )
}
