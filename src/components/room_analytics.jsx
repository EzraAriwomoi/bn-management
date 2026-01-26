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
import "@/components/css/room_analytics.css";

export function RoomAnalytics({ bookings = [] }) {
  const [period, setPeriod] = useState("day");
  const metricsData = getMetricsForPeriod(period);

  const today = new Date();

  const isSameDay = (date) =>
    new Date(date).toDateString() === today.toDateString();

  const isSameWeek = (date) => {
    const d = new Date(date);
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return d >= start && d <= end;
  };

  const isSameMonth = (date) =>
    new Date(date).getMonth() === today.getMonth() &&
    new Date(date).getFullYear() === today.getFullYear();

  const roomsOccupied = (() => {
    const active = bookings.filter((b) => {
      const checkIn = new Date(b.check_in);
      const checkOut = new Date(b.check_out);

      if (period === "day") return today >= checkIn && today <= checkOut;
      if (period === "week")
        return (
          isSameWeek(checkIn) ||
          isSameWeek(checkOut) ||
          (checkIn <= today && checkOut >= today)
        );
      if (period === "month")
        return (
          isSameMonth(checkIn) ||
          isSameMonth(checkOut) ||
          (checkIn <= today && checkOut >= today)
        );

      return false;
    });

    return new Set(active.map((b) => b.house)).size;
  })();

  const unoccupiedRoomsToday = (() => {
    if (period !== "day") return [];

    const allRooms = metricsData.map((r) => r.roomName);

    const occupied = bookings
      .filter((b) => {
        const checkIn = new Date(b.check_in);
        const checkOut = new Date(b.check_out);
        return today >= checkIn && today <= checkOut;
      })
      .map((b) => b.house);

    const occupiedSet = new Set(occupied);
    return allRooms.filter((room) => !occupiedSet.has(room));
  })();

  const vacantCounts = (() => {
    if (period === "day") return [];

    return metricsData.map((room) => {
      const roomBookings = bookings.filter((b) => b.house === room.roomName);

      let vacant = 0;

      roomBookings.forEach((b) => {
        const checkIn = new Date(b.check_in);
        const checkOut = new Date(b.check_out);

        if (period === "week" && !isSameWeek(checkIn) && !isSameWeek(checkOut))
          vacant++;

        if (
          period === "month" &&
          !isSameMonth(checkIn) &&
          !isSameMonth(checkOut)
        )
          vacant++;
      });

      return { room: room.roomName, vacant };
    });
  })();

  const outstandingToday = bookings
    .filter((b) => isSameDay(b.check_in) && b.payment_status !== "Paid")
    .reduce((sum, b) => sum + (b.amount_due || 0), 0);

  const totalOutstanding = bookings
    .filter((b) => b.payment_status !== "Paid")
    .reduce((sum, b) => sum + (b.amount_due || 0), 0);

  const outstandingReceivedToday = bookings
    .filter(
      (b) =>
        isSameDay(b.payment_date) &&
        b.payment_status === "Paid" &&
        b.was_outstanding === true,
    )
    .reduce((sum, b) => sum + (b.amount_paid || 0), 0);

  const outstandingReceivedOtherDays = bookings
    .filter(
      (b) =>
        !isSameDay(b.payment_date) &&
        b.payment_status === "Paid" &&
        b.was_outstanding === true,
    )
    .reduce((sum, b) => sum + (b.amount_paid || 0), 0);

  const totalRevenue = metricsData.reduce((sum, r) => sum + r.revenue, 0);

  /* ------------------ CHART DATA ------------------ */
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
  ];

  const revenueYAxisMax =
    period === "day" ? 6000 : period === "week" ? 18000 : 80000;

  return (
    <div className="room-analytics">
      <Card>
        <CardHeader>
          <CardTitle>Room Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="period-buttons">
            {["day", "week", "month"].map((p) => (
              <Button
                key={p}
                onClick={() => setPeriod(p)}
                className={`capitalize period-btn ${
                  period === p ? "period-btn-active" : ""
                }`}
                variant="outline"
              >
                {p}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Rooms Occupied
            </CardTitle>
          </CardHeader>
          <CardContent>
            {period === "day" ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="kpi-value">{roomsOccupied}</span>
                  <span className="text-muted-foreground text-lg">/</span>
                  <span className="text-sm text-muted-foreground">
                    {metricsData.length}
                  </span>
                </div>

                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  {unoccupiedRoomsToday.length ? (
                    unoccupiedRoomsToday.map((room, i) => (
                      <div key={room}>
                        {i + 1}. {room}
                      </div>
                    ))
                  ) : (
                    <div>All rooms occupied</div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground space-y-1">
                {vacantCounts.map((r) => (
                  <div key={r.room} className="flex justify-between">
                    <span>{r.room}</span>
                    <span className="text-gray-400">{r.vacant}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="kpi-value">KES {totalRevenue.toLocaleString()}</div>
            <p className="kpi-subtext">This {period}</p>

            {period === "day" && (
              <div className="mt-3 pt-2 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Outstanding received today:
                  </span>
                  <span className="text-green-600">
                    KSH {outstandingReceivedToday.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Outstanding (other days):
                  </span>
                  <span className="text-emerald-500">
                    KSH {outstandingReceivedOtherDays.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Outstanding Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Outstanding Today</p>
            <p className="text-lg font-semibold text-red-500">
              KES {outstandingToday.toLocaleString()}
            </p>

            <div className="mt-3 pt-2 border-t">
              <p className="text-xs text-muted-foreground">Total Outstanding</p>
              <p className="font-medium text-orange-500">
                KES {totalOutstanding.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="charts-grid">
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate by Room</CardTitle>
            <CardDescription>Percentage of days occupied</CardDescription>
          </CardHeader>
          <CardContent className="chart-wrapper">
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
          <CardContent className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, revenueYAxisMax]} />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Occupancy Distribution</CardTitle>
          <CardDescription>Occupancy across rooms</CardDescription>
        </CardHeader>
        <CardContent className="chart-wrapper h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, value }) => `${name}: ${Math.round(value)}%`}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={roomColors[i % roomColors.length]} />
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
