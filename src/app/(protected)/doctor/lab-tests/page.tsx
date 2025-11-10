"use client"

import { useEffect, useState } from "react"
import { LabTestsDetail } from "./components/lab-tests-detail"
import { LabTestOrder } from "@/types/examnation"
import { LabTestOrderList } from "./components/lab-test-order-list"
import { appointmentService } from "@/services/appointment.service"
import { Loader2 } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux"
import { LabTestOrderResponse } from "@/types/examnation/response/lab-test.response"

export default function LabTestsPage() {
  const [selectedOrder, setSelectedOrder] = useState<LabTestOrderResponse | null>(null)
  const [orders, setOrders] = useState<LabTestOrderResponse[]>([])

  const [loading, setLoading] = useState(true)
  const doctorId = useSelector((state: RootState) => state.auth.user?.referenceId);
  useEffect(() => {
    const fetchLabTestOrders = async () => {
      if (!doctorId) return
      try {
        setLoading(true)
        const data = await appointmentService.getLabTestOrderByDoctorId(doctorId)
        console.log(data)
        setOrders(data)
        if (data.length > 0) {
          setSelectedOrder(data[0])
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách xét nghiệm:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLabTestOrders()
  }, [])

  const handleUpdateOrder = (updatedOrder: LabTestOrderResponse) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o))
    if (selectedOrder?.id === updatedOrder.id) {
      setSelectedOrder(updatedOrder)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center text-center space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p>Đang tải danh sách xét nghiệm...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 overflow-hidden">
        <LabTestOrderList orders={orders} selectedOrder={selectedOrder} onSelectOrder={setSelectedOrder} />

        {/* Lab Tests Detail */}
        <div className="flex-1 overflow-auto">
          {selectedOrder ? (
            <LabTestsDetail order={selectedOrder} onUpdateOrder={handleUpdateOrder} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground text-lg">Chọn một bệnh nhân để xem chi tiết xét nghiệm</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
