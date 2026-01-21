export function getMetricsForPeriod(period) {
  // Mock analytics data (replace later with real logic)
  return [
    {
      roomId: 1,
      roomName: "Studio A",
      occupancyRate: period === "day" ? 70 : period === "week" ? 82 : 88,
      revenue: period === "day" ? 4500 : period === "week" ? 32000 : 120000,
      bookings: period === "day" ? 1 : period === "week" ? 5 : 18,
    },
    {
      roomId: 2,
      roomName: "Studio B",
      occupancyRate: period === "day" ? 55 : period === "week" ? 74 : 81,
      revenue: period === "day" ? 3800 : period === "week" ? 27000 : 98000,
      bookings: period === "day" ? 1 : period === "week" ? 4 : 14,
    },
    {
      roomId: 3,
      roomName: "One Bedroom",
      occupancyRate: period === "day" ? 90 : period === "week" ? 92 : 95,
      revenue: period === "day" ? 6200 : period === "week" ? 41000 : 150000,
      bookings: period === "day" ? 1 : period === "week" ? 6 : 22,
    },
  ];
}
