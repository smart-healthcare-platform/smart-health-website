"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatCards({
    total,
    today,
    completed
}: {
    total: number
    today: number
    completed: number
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">
                        Tổng lịch hẹn
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{total}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">
                        Lịch hẹn hôm nay
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{today}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">
                        Đã hoàn thành
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{completed}</p>
                </CardContent>
            </Card>
        </div>
    )
}
