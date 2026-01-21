"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMetricsForPeriod } from "../lib/room_data";

export function RoomAnalytics() {
  const [period, setPeriod] = useState("month");
  const metricsData = getMetricsForPeriod(period);

  // Chart data
  const occupancyChartData = metricsData.map((room) => ({
    name: room.roomName,
    occupancyRate: Math.round(room.occupancyRate),
  }));

  const revenueChartData = metricsData.map((room) => ({
    name: room.roomName,
    revenue: room.revenue,
  }));

  const pieData = metricsData.map((room) => ({
    name: room.roomName,
    value: room.occupancyRate,
  }));

  const roomColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--destructive))",
  ];

  // Totals
  const totalOccupancy = Math.round(
    metricsData.reduce((sum, r) => sum + r.occupancyRate, 0) /
      metricsData.length
  );
  const totalRevenue = metricsData.reduce((sum, r) => sum + r.revenue, 0);
  const totalBookings = metricsData.reduce((sum, r) => sum + r.bookings, 0);
  const topRoom = metricsData.reduce((prev, current) =>
    current.occupancyRate > prev.occupancyRate ? current : prev
  );

  return (
    <div className="space-y-8">
      {/* Period Selector */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Room Performance Analytics
        </h2>
        <div className="flex gap-3">
          {["day", "week", "month"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              onClick={() => setPeriod(p)}
              className="capitalize"
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Avg Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOccupancy}%</div>
            <p className="text-sm text-muted-foreground">Across all rooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              KES {totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">This {period}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBookings}</div>
            <p className="text-sm text-muted-foreground">Active bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Best Performing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{topRoom.roomName}</div>
            <p className="text-sm text-muted-foreground">
              {Math.round(topRoom.occupancyRate)}% occupancy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate by Room</CardTitle>
            <CardDescription>Percentage of days occupied</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="occupancyRate" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Room</CardTitle>
            <CardDescription>Total earnings in KES</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Occupancy Distribution</CardTitle>
          <CardDescription>Occupancy across rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, value }) =>
                  `${name}: ${Math.round(value)}%`
                }
              >
                {pieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={roomColors[i % roomColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${Math.round(v)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
