import { FileText, Calendar, Users } from "lucide-react"
import { Card } from "@/components/ui/card"

export function MedicalRecordsHeader() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Bệnh Án</h1>
          <p className="text-gray-600 mt-2">Quản lý và theo dõi các bệnh án đã khám</p>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng bệnh án</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tháng này</p>
              <p className="text-2xl font-bold text-gray-900">32</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bệnh nhân</p>
              <p className="text-2xl font-bold text-gray-900">189</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
