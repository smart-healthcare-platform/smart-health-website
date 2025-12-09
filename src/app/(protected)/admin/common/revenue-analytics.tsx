"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import {
  useRevenueStats,
  useRevenueDistribution,
  useRevenueTrends,
  usePaymentMethodsAnalytics,
} from "@/hooks/useAdminDashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const STATUS_COLORS = {
  completed: "hsl(var(--success))",
  pending: "hsl(var(--warning))",
  failed: "hsl(var(--destructive))",
  cancelled: "hsl(var(--muted))",
}

export function RevenueAnalytics() {
  const [trendPeriod, setTrendPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily')
  const { data: revenueStats, isLoading: statsLoading, error: statsError } = useRevenueStats()
  const { data: distribution, isLoading: distributionLoading, error: distributionError } = useRevenueDistribution()
  const { data: trends, isLoading: trendsLoading, error: trendsError } = useRevenueTrends(trendPeriod, trendPeriod === 'daily' ? 30 : undefined)
  const { data: paymentMethods, isLoading: methodsLoading, error: methodsError } = usePaymentMethodsAnalytics()

  if (statsLoading) {
    return <RevenueAnalyticsSkeleton />
  }

  // Show info banner if critical data failed to load but continue rendering with safe defaults
  const hasErrors = statsError || distributionError

  // Provide default values if data is missing
  const safeStats = {
    totalRevenue: revenueStats?.totalRevenue ?? 0,
    todayRevenue: revenueStats?.todayRevenue ?? 0,
    monthRevenue: revenueStats?.monthRevenue ?? 0,
    yearRevenue: revenueStats?.yearRevenue ?? 0,
    totalPayments: revenueStats?.totalPayments ?? 0,
    completedPayments: revenueStats?.completedPayments ?? 0,
    pendingPayments: revenueStats?.pendingPayments ?? 0,
    failedPayments: revenueStats?.failedPayments ?? 0,
    averagePaymentAmount: revenueStats?.averagePaymentAmount ?? 0,
    completionRate: revenueStats?.completionRate ?? 0,
    revenueGrowthRate: revenueStats?.revenueGrowthRate ?? 0,
    fromCache: revenueStats?.fromCache,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const statsCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(safeStats.totalRevenue),
      change: safeStats.revenueGrowthRate,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "This Month",
      value: formatCurrency(safeStats.monthRevenue),
      subtitle: `${safeStats.totalPayments} payments`,
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Success Rate",
      value: `${safeStats.completionRate.toFixed(1)}%`,
      subtitle: `${safeStats.completedPayments} completed`,
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Avg. Transaction",
      value: formatCurrency(safeStats.averagePaymentAmount),
      subtitle: `from ${safeStats.totalPayments} payments`,
      icon: CreditCard,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  const paymentMethodChartData = distribution?.byPaymentMethod?.map((m) => ({
    name: m.method,
    value: m.count,
    revenue: m.amount,
    percentage: m.percentage,
  })) || []

  const paymentStatusChartData = distribution?.byStatus?.map((s) => ({
    name: s.status,
    value: s.count,
    revenue: s.amount,
    percentage: s.percentage,
  })) || []

  const trendChartData = trends?.data?.map((t) => ({
    date: t.label || new Date(t.date).toLocaleDateString('vi-VN', { 
      month: 'short', 
      day: 'numeric',
      ...(trendPeriod === 'monthly' || trendPeriod === 'yearly' ? { year: '2-digit' } : {})
    }),
    revenue: t.revenue,
    count: t.paymentCount,
    averageAmount: t.averageAmount,
  })) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Revenue Analytics</h2>
          <p className="text-muted-foreground">Comprehensive financial insights and payment analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          {safeStats.fromCache && (
            <Badge variant="outline" className="text-xs">
              Cached data
            </Badge>
          )}
          <Button variant="outline" size="sm">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {hasErrors && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900">Billing Service Unavailable</p>
                <p className="text-sm text-amber-700 mt-1">
                  Unable to connect to the Billing service. Showing default values. Please ensure the service is running.
                </p>
                {statsError && (
                  <p className="text-xs text-amber-600 mt-1">
                    Error: {statsError.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              {stat.change !== undefined && (
                <div className={`flex items-center space-x-1 text-xs mt-1 ${
                  stat.change >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {stat.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  <span>{Math.abs(stat.change).toFixed(1)}% from last period</span>
                </div>
              )}
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trends Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                Revenue and transaction trends over time
              </CardDescription>
            </div>
            <Tabs value={trendPeriod} onValueChange={(v) => setTrendPeriod(v as 'daily' | 'weekly' | 'monthly' | 'yearly')}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" className="text-xs">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {trendsLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : trendChartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(value: number | string, name: string) => {
                      if (name === 'revenue') return [formatCurrency(Number(value)), 'Revenue']
                      return [value, name]
                    }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="successful"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 3 }}
                    name="Successful"
                  />
                </LineChart>
              </ResponsiveContainer>
              {trends && !trendsError && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="text-lg font-bold">{formatCurrency(trends.totalRevenue || 0)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Total Transactions</p>
                    <p className="text-lg font-bold">{trends.totalTransactions || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Avg per Period</p>
                    <p className="text-lg font-bold">{formatCurrency(trends.averagePerPeriod || 0)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Growth Rate</p>
                    <p className={`text-lg font-bold ${(trends.percentageChange || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {(trends.percentageChange || 0) >= 0 ? '+' : ''}{(trends.percentageChange || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}
              {trendsError && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-center text-sm text-muted-foreground">
                    Unable to load trend statistics
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              No trend data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Distribution Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Payment Methods
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Distribution by payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            {distributionLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : paymentMethodChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={paymentMethodChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodChartData.map((entry: { name: string; value: number; revenue: number; percentage: number }, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number | string, name: string) => {
                        if (name === 'value') return [value, 'Transactions']
                        return [value, name]
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {distribution?.byPaymentMethod?.map((method, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{method.method}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(method.amount)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No payment method data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Payment Status
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Distribution by payment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {distributionLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : paymentStatusChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={paymentStatusChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip
                      formatter={(value: number | string, name: string) => {
                        if (name === 'value') return [value, 'Transactions']
                        return [value, name]
                      }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Transactions">
                      {paymentStatusChartData.map((entry: { name: string; value: number; revenue: number; percentage: number }, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {distribution?.byStatus?.map((status, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg border">
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          status.status === 'completed' ? 'default' :
                          status.status === 'pending' ? 'secondary' :
                          status.status === 'failed' ? 'destructive' : 'outline'
                        }>
                          {status.status}
                        </Badge>
                        <span className="text-muted-foreground">{status.count} transactions</span>
                      </div>
                      <span className="font-medium">{formatCurrency(status.amount)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No status data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods Analytics</CardTitle>
          <CardDescription>
            Detailed performance metrics for each payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          {methodsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : methodsError ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">Unable to load payment methods analytics</p>
              <Badge variant="outline" className="text-xs">
                Error: {methodsError.message}
              </Badge>
            </div>
          ) : paymentMethods?.methods && paymentMethods.methods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.methods.map((method, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-lg">{method.method}</h4>
                      <p className="text-sm text-muted-foreground">
                        {method.totalTransactions} transactions • {method.usagePercentage.toFixed(1)}% usage
                      </p>
                    </div>
                    <Badge 
                      variant={method.successRate >= 90 ? 'default' : method.successRate >= 70 ? 'secondary' : 'destructive'}
                    >
                      {method.successRate.toFixed(1)}% success
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Revenue</p>
                      <p className="text-sm font-semibold">{formatCurrency(method.totalRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Amount</p>
                      <p className="text-sm font-semibold">{formatCurrency(method.averageTransactionAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue Share</p>
                      <p className="text-sm font-semibold">{method.revenuePercentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Failed</p>
                      <p className="text-sm font-semibold text-destructive">{method.failedTransactions}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium">{method.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          method.successRate >= 90 ? 'bg-success' : 
                          method.successRate >= 70 ? 'bg-warning' : 'bg-destructive'
                        }`}
                        style={{ width: `${method.successRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {paymentMethods && (
                <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-accent">
                    <p className="text-xs text-muted-foreground">Most Reliable</p>
                    <p className="text-sm font-bold">{paymentMethods.mostReliableMethod}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent">
                    <p className="text-xs text-muted-foreground">Most Used</p>
                    <p className="text-sm font-bold">{paymentMethods.mostUsedMethod}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent">
                    <p className="text-xs text-muted-foreground">Highest Revenue</p>
                    <p className="text-sm font-bold">{paymentMethods.highestRevenueMethod}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No payment methods analytics available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function RevenueAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    </div>
  )
}