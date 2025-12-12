"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { LabTestOrder } from "@/types/examnation"
import { LabTestOrderResponse } from "@/types/examnation/response/lab-test.response"
import { formatDateTime } from "@/lib/format"

interface LabTestOrderList {
  orders: LabTestOrderResponse[]
  selectedOrder: LabTestOrderResponse | null
  onSelectOrder: (order: LabTestOrderResponse) => void
}

export function LabTestOrderList({ orders, selectedOrder, onSelectOrder }: LabTestOrderList) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = orders.filter(
    (order) =>
      order.appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  return (
    <Card className="w-80 h-full rounded-none border-r flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-base">Danh sách xét nghiệm</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm bệnh nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">Không tìm thấy xét nghiệm</div>
        ) : (
          <div className="py-4 space-y-1">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`
                  mx-2 p-3 rounded-lg cursor-pointer transition-colors
                  ${selectedOrder?.id === order.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"}
                `}
                onClick={() => onSelectOrder(order)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{order.appointment.patientName}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Thời gian: {formatDateTime(order.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
