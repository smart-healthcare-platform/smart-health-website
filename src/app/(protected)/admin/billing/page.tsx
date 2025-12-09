"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { toast } from "react-toastify";
import { billingService, type PaymentResponse } from "@/services/billing.service";

interface RevenueStats {
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
}

interface PaymentMethodStats {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export default function AdminBillingPage() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<string>("7");
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalRevenue: 0,
    totalTransactions: 0,
    averageTransaction: 0,
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0,
  });
  const [recentPayments, setRecentPayments] = useState<PaymentResponse[]>([]);
  const [methodStats, setMethodStats] = useState<PaymentMethodStats[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const days = parseInt(dateRange);
      const endDate = format(new Date(), "yyyy-MM-dd");
      const startDate = format(subDays(new Date(), days), "yyyy-MM-dd");

      // Fetch payments in date range
      const response = await billingService.searchPayments({
        startDate,
        endDate,
        page: 0,
        size: 100,
      });

      const payments = response.content;

      // Calculate revenue stats
      const completedPayments = payments.filter((p) => p.status === "COMPLETED");
      const totalRevenue = completedPayments.reduce(
        (sum, p) => sum + Number(p.amount),
        0
      );
      const averageTransaction =
        completedPayments.length > 0 ? totalRevenue / completedPayments.length : 0;

      setRevenueStats({
        totalRevenue,
        totalTransactions: payments.length,
        averageTransaction,
        completedCount: completedPayments.length,
        pendingCount: payments.filter((p) => p.status === "PENDING").length,
        failedCount: payments.filter((p) => p.status === "FAILED").length,
      });

      // Calculate payment method stats
      const methodMap = new Map<string, { count: number; amount: number }>();
      completedPayments.forEach((p) => {
        const method = p.paymentMethod;
        const existing = methodMap.get(method) || { count: 0, amount: 0 };
        methodMap.set(method, {
          count: existing.count + 1,
          amount: existing.amount + Number(p.amount),
        });
      });

      const totalAmount = completedPayments.reduce(
        (sum, p) => sum + Number(p.amount),
        0
      );

      const methodStatsArray: PaymentMethodStats[] = Array.from(
        methodMap.entries()
      ).map(([method, data]) => ({
        method,
        count: data.count,
        amount: data.amount,
        percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
      }));

      setMethodStats(methodStatsArray);

      // Get recent payments (last 10)
      setRecentPayments(payments.slice(0, 10));

      console.log("✅ Dashboard data loaded");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("vi-VN") + " ₫";
  };

  const getPaymentMethodBadge = (method: string) => {
    const methodMap: Record<string, { label: string; className: string }> = {
      CASH: { label: "Tiền mặt", className: "bg-green-500" },
      MOMO: { label: "MoMo", className: "bg-pink-500" },
      VNPAY: { label: "VNPay", className: "bg-blue-500" },
    };

    const info = methodMap[method] || { label: method, className: "bg-gray-500" };
    return (
      <Badge className={info.className + " text-white"}>{info.label}</Badge>
    );
  };

  const getPaymentTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      APPOINTMENT_FEE: { label: "Phí khám", className: "bg-blue-500" },
      LAB_TEST: { label: "Xét nghiệm", className: "bg-green-500" },
      PRESCRIPTION: { label: "Đơn thuốc", className: "bg-purple-500" },
      OTHER: { label: "Khác", className: "bg-gray-500" },
    };

    const info = typeMap[type] || { label: type, className: "bg-gray-500" };
    return <Badge className={info.className + " text-white"}>{info.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; icon: any; className: string }> =
      {
        COMPLETED: {
          label: "Hoàn thành",
          icon: CheckCircle2,
          className: "bg-green-500",
        },
        PENDING: { label: "Chờ xử lý", icon: Clock, className: "bg-yellow-500" },
        FAILED: { label: "Thất bại", icon: XCircle, className: "bg-red-500" },
        CANCELLED: { label: "Đã hủy", icon: XCircle, className: "bg-gray-500" },
      };

    const info = statusMap[status] || {
      label: status,
      icon: Clock,
      className: "bg-gray-500",
    };
    const Icon = info.icon;
    return (
      <Badge className={info.className + " text-white"}>
        <Icon className="h-3 w-3 mr-1" />
        {info.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Thanh toán</h1>
          <p className="text-muted-foreground">
            Tổng quan doanh thu và giao dịch
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Hôm nay</SelectItem>
              <SelectItem value="7">7 ngày qua</SelectItem>
              <SelectItem value="30">30 ngày qua</SelectItem>
              <SelectItem value="90">90 ngày qua</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchDashboardData} disabled={loading} variant="outline">
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Revenue Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(revenueStats.totalRevenue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {revenueStats.completedCount} giao dịch hoàn thành
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Transaction */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trung bình/giao dịch</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(revenueStats.averageTransaction)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Giá trị trung bình
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-purple-600">
                  {revenueStats.totalTransactions}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-green-600 flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {revenueStats.completedCount}
                  </span>
                  <span className="text-xs text-yellow-600 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {revenueStats.pendingCount}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tỷ lệ thành công</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {revenueStats.totalTransactions > 0
                    ? (
                        (revenueStats.completedCount /
                          revenueStats.totalTransactions) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {revenueStats.failedCount} giao dịch thất bại
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Phương thức thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            {methodStats.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Chưa có dữ liệu
              </div>
            ) : (
              <div className="space-y-4">
                {methodStats.map((stat) => (
                  <div key={stat.method} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {getPaymentMethodBadge(stat.method)}
                      </span>
                      <span className="text-muted-foreground">
                        {stat.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {stat.count} giao dịch
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(stat.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-muted-foreground py-8">
                Đang tải...
              </div>
            ) : recentPayments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Chưa có giao dịch nào
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã thanh toán</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Phương thức</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thời gian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPayments.map((payment) => (
                      <TableRow key={payment.paymentCode}>
                        <TableCell className="font-mono text-xs">
                          {payment.paymentCode.slice(0, 12)}...
                        </TableCell>
                        <TableCell>
                          {getPaymentTypeBadge(payment.paymentType)}
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodBadge(payment.paymentMethod)}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(Number(payment.amount))}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(payment.createdAt), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Đang chờ xử lý</p>
                <p className="text-2xl font-bold">{revenueStats.pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Thất bại</p>
                <p className="text-2xl font-bold">{revenueStats.failedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                <p className="text-2xl font-bold">{revenueStats.completedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}