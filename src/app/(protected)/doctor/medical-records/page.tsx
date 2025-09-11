import { MedicalRecordsHeader } from "./component/medical-records-header";
import { RecordFilters } from "./component/record-fillters";
import { RecordsList } from "./component/record-list";


export default function MedicalRecordsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <MedicalRecordsHeader />
        <RecordFilters />
        <RecordsList />
      </div>
    </div>
  )
}
