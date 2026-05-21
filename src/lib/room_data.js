// export function getMetricsForPeriod(period) {
//   const periodMap = {
//     day: {
//       studios: {
//         occupancy: [65, 72, 60, 68],
//         revenue: [3500, 3800, 3300, 3600],
//         bookings: [1, 1, 1, 1],
//       },
//       oneBedroom: {
//         occupancy: [85, 88, 82, 90],
//         revenue: [5500, 5800, 5200, 6000],
//         bookings: [1, 1, 1, 1],
//       },
//     },
//     week: {
//       studios: {
//         occupancy: [78, 80, 75, 79],
//         revenue: [16000, 18000, 15000, 17000],
//         bookings: [4, 5, 4, 5],
//       },
//       oneBedroom: {
//         occupancy: [90, 92, 89, 94],
//         revenue: [18000, 18000, 16000, 18000],
//         bookings: [6, 6, 5, 7],
//       },
//     },
//     month: {
//       studios: {
//         occupancy: [85, 88, 82, 87],
//         revenue: [55000, 58000, 50000, 60000],
//         bookings: [15, 17, 14, 16],
//       },
//       oneBedroom: {
//         occupancy: [94, 96, 93, 97],
//         revenue: [58000, 60000, 57000, 60000],
//         bookings: [22, 23, 21, 24],
//       },
//     },
//   };

//   const data = periodMap[period];

//   const rooms = [
//     { id: 1, name: "B1-3", type: "studios", index: 0 },
//     { id: 2, name: "B2-8", type: "studios", index: 1 },
//     { id: 3, name: "B3-10", type: "studios", index: 2 },
//     { id: 4, name: "B7-7", type: "studios", index: 3 },
//     { id: 5, name: "A4", type: "oneBedroom", index: 0 },
//     { id: 6, name: "A5", type: "oneBedroom", index: 1 },
//     { id: 7, name: "G3", type: "oneBedroom", index: 2 },
//     { id: 8, name: "1B", type: "oneBedroom", index: 3 },
//   ];

//   return rooms.map((room) => ({
//     roomId: room.id,
//     roomName: room.name,
//     occupancyRate: data[room.type].occupancy[room.index],
//     revenue: data[room.type].revenue[room.index],
//     bookings: data[room.type].bookings[room.index],
//   }));
// }
