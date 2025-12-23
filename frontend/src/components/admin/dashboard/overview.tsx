"use client"

import * as React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    Bar,
} from "recharts"
import {
    DollarSign,
    ShoppingCart,
    Users,
    TrendingUp,
} from "lucide-react"


// Define interfaces for the data structure
interface SalesChartData {
    name: string;
    total: number;
    [key: string]: string | number;
}

interface OrderDistributionData {
    name: string;
    value: number;
    [key: string]: string | number;
}

interface TopProductData {
    name: string;
    sales: number;
    [key: string]: string | number;
}

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalSales: number; // Items sold
    totalUsers: number;
    salesChartData: SalesChartData[];
    orderDistribution: OrderDistributionData[];
    topProducts: TopProductData[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function DashboardOverview() {
    // Dummy data for visualization
    const stats: DashboardStats = {
        totalRevenue: 45231,
        totalOrders: 156,
        totalSales: 342,
        totalUsers: 89,
        salesChartData: [
            { name: "Jan", total: 1200 },
            { name: "Feb", total: 2100 },
            { name: "Mar", total: 800 },
            { name: "Apr", total: 1600 },
            { name: "May", total: 900 },
            { name: "Jun", total: 1700 },
        ],
        orderDistribution: [
            { name: "Delivered", value: 80 },
            { name: "Pending", value: 30 },
            { name: "Processing", value: 25 },
            { name: "Cancelled", value: 15 },
        ],
        topProducts: [
            { name: "Chanel No. 5", sales: 45 },
            { name: "Dior Sauvage", sales: 38 },
            { name: "Gucci Bloom", sales: 32 },
            { name: "Versace Eros", sales: 28 },
            { name: "YSL Black Opium", sales: 22 },
        ],
    };

    const isLoading = false;

    const metrics = [
        {
            title: "Total Revenue",
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            description: "Total earnings",
        },
        {
            title: "Orders",
            value: stats.totalOrders.toString(),
            icon: ShoppingCart,
            description: "Total orders received",
        },
        {
            title: "Sales",
            value: stats.totalSales.toString(),
            icon: TrendingUp,
            description: "Total items sold",
        },
        {
            title: "Active Users",
            value: stats.totalUsers.toString(),
            icon: Users,
            description: "Registered users",
        },
    ]



    // Default empty data if undefined to prevent chart crashes
    const salesChartData = stats.salesChartData || [];
    const orderDistribution = stats.orderDistribution || [];
    const topProducts = stats.topProducts || [];

    return (
        <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {metric.title}
                            </CardTitle>
                            <metric.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {metric.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Sales Overview (Area Chart) */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                        <CardDescription>
                            Monthly revenue for the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesChartData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <Tooltip
                                        formatter={(value: number | undefined) => [`₹${value}`, "Revenue"]}
                                        contentStyle={{ borderRadius: '8px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#8884d8"
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Distribution (Pie Chart) */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Order Distribution</CardTitle>
                        <CardDescription>
                            Orders by status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orderDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {orderDistribution.map((entry: OrderDistributionData, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Best Selling Products (Bar Chart) */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>
                        Highest selling products this month
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="sales" fill="#82ca9d" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
