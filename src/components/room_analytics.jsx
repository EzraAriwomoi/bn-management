"use client";

import { useState, useEffect } from "react";
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
import "@/components/css/room_analytics.css";

export function RoomAnalytics() {
  const [period, setPeriod] = useState("today");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // -------------------- DATE HELPERS --------------------
  const getPeriodStartEnd = () => {
    let start = today;
    let end = today;

    if (period === "week") {
      start = new Date(today);
      start.setDate(today.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end = new Date(today);
      end.setHours(23, 59, 59, 999);
    } else if (period === "month") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today);
      end.setHours(23, 59, 59, 999);
    } else if (period === "lastMonth") {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  };

  const getTotalDaysInPeriod = () => {
    const { start, end } = getPeriodStartEnd();
    return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  // -------------------- FETCH DATA --------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsRes, bookingsRes, metricsRes] = await Promise.all([
          fetch("http://localhost:8000/api/rooms/"),
          fetch("http://localhost:8000/api/bookings/"),
          fetch(`http://localhost:8000/api/room-metrics/?period=${period}`),
        ]);

        setRooms(await roomsRes.json());
        setBookings(await bookingsRes.json());
        setMetrics(await metricsRes.json());
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (loading) return <div>Loading analytics...</div>;

  // -------------------- METRICS --------------------
  const metricsData = rooms.map((room) => {
    const metric = metrics.find((m) => m.room === room.name);

    return {
      roomName: room.name,
      occupiedDays: metric?.occupied_nights || 0,
      revenue: metric?.revenue || 0,
      totalDays: metric?.total_days_in_period || getTotalDaysInPeriod(), // fallback
    };
  });

  const totalPeriodDays = metricsData[0]?.totalDays || getTotalDaysInPeriod();
  const roomsOccupied = metricsData.filter((r) => r.occupiedDays > 0).length;
  const vacantRoomsToday =
    period === "today"
      ? metricsData.filter((r) => r.occupiedDays === 0).map((r) => r.roomName)
      : [];

  // -------------------- OUTSTANDING --------------------
  const outstandingToday = bookings
    .filter(
      (b) =>
        new Date(b.check_in).toDateString() === today.toDateString() &&
        b.payment_status === "Unpaid",
    )
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const totalOutstandingPrevious = bookings
    .filter(
      (b) => new Date(b.check_in) < today && b.payment_status === "Unpaid",
    )
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const totalOutstanding = outstandingToday + totalOutstandingPrevious;

  // -------------------- CHART DATA --------------------
  const totalRevenue = metricsData.reduce((sum, r) => sum + r.revenue, 0);

  const occupancyChartData = metricsData.map((r) => ({
    name: r.roomName,
    occupancy: r.occupiedDays,
    label: `${r.occupiedDays}/${totalPeriodDays}`,
  }));

  const revenueChartData = metricsData.map((r) => ({
    name: r.roomName,
    revenue: r.revenue,
  }));

  const pieData = metricsData.map((r) => ({
    name: r.roomName,
    value: r.occupiedDays,
  }));

  const roomColors = [
    "#f8ee5e",
    "#663711",
    "#7e7e7e",
    "#4BC0C0",
    "#3c158a",
    "#000000",
    "#d8b92f",
  ];

  const formatDate = (date) => {
    const d = date.getDate();
    const suffix =
      d % 10 === 1 && d !== 11
        ? "st"
        : d % 10 === 2 && d !== 12
          ? "nd"
          : d % 10 === 3 && d !== 13
            ? "rd"
            : "th";
    return `${d}${suffix} ${date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`;
  };

  const getPeriodRangeLabel = () => {
    const { start, end } = getPeriodStartEnd();
    if (period === "today") return formatDate(today);
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  const revenueYAxisMax =
    period === "today" ? 6000 : period === "week" ? 18000 : 80000;

  // -------------------- JSX --------------------
  return (
    <div className="room-analytics">
      {/* Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Room Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="period-buttons">
            {["today", "week", "month", "lastMonth"].map((p) => (
              <Button
                key={p}
                variant="outline"
                onClick={() => setPeriod(p)}
                className={`capitalize period-btn ${period === p ? "period-btn-active" : ""}`}
              >
                {p === "lastMonth" ? "Last Month" : p}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Rooms Occupied */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Rooms Occupied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="kpi-value">{roomsOccupied}</span>
              <span className="text-muted-foreground text-lg">/</span>
              <span className="text-sm text-muted-foreground">
                {rooms.length}
              </span>
            </div>
            {period === "today" && (
              <div className="mt-2 text-xs text-muted-foreground space-y-1">
                {vacantRoomsToday.length ? (
                  vacantRoomsToday.map((r, i) => (
                    <div key={r}>
                      {i + 1}. {r}
                    </div>
                  ))
                ) : (
                  <div>All rooms occupied</div>
                )}
              </div>
            )}
            {period !== "today" && (
              <div className="text-sm text-muted-foreground space-y-1">
                {/* Calculate max and min occupancy */}
                {(() => {
                  const occupiedValues = metricsData.map((r) => r.occupiedDays);
                  const maxOccupied = Math.max(...occupiedValues);
                  const minOccupied = Math.min(...occupiedValues);

                  return metricsData.map((r) => {
                    const isMax = r.occupiedDays === maxOccupied;
                    const isMin = r.occupiedDays === minOccupied;

                    return (
                      <div
                        key={r.roomName}
                        className="flex justify-between items-center"
                      >
                        <span>{r.roomName}</span>
                        <span
                          className={`px-2 py-1 rounded-md font-medium ${
                            isMax
                              ? "bg-green-200 text-green-800"
                              : isMin
                                ? "bg-red-200 text-red-800"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {r.occupiedDays} / {r.totalDays}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="kpi-value">KES {totalRevenue.toLocaleString()}</div>
            <p className="kpi-subtext">
              {period === "lastMonth"
                ? "Last month"
                : period === "today"
                  ? "Today"
                  : `This ${period}`}
            </p>
          </CardContent>
        </Card>

        {/* Outstanding */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Outstanding Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-black">
              KES {totalOutstanding.toLocaleString()}
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Outstanding Today</span>
                <span className="text-red-500 font-medium">
                  KES {outstandingToday.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Previous Outstanding
                </span>
                <span className="text-orange-500 font-medium">
                  KES {totalOutstandingPrevious.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <Card>
          <CardHeader>
            <CardTitle>Room Occupancy</CardTitle>
            <CardDescription>
              Days occupied out of total days in period
            </CardDescription>
          </CardHeader>
          <CardContent className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} days`} />
                <Bar dataKey="occupancy" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Room</CardTitle>
            <CardDescription>
              Total earnings in KES
              <div className="text-xs text-muted-foreground mt-1">
                {getPeriodRangeLabel()}
              </div>
            </CardDescription>
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

      {/* Occupancy Pie */}
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
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={roomColors[i % roomColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} days`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
