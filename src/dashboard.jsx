"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "./components/dashboard_header";
import { BookingsCalendar } from "./components/bookings_calendar";
import { BookingsTable } from "./components/bookings_table";
import { BookingsFilter } from "./components/bookings_filter";
import { RoomAnalytics } from "./components/room_analytics";

import "@/components/css/dashboard.css";

const API_BASE = "http://127.0.0.1:8000/api";

export function DashboardClient() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/bookings/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return res.json();
      })
      .then((data) => {
        // Sort by most recent check-in date
        const sorted = data.sort(
          (a, b) => new Date(b.check_in) - new Date(a.check_in),
        );

        setBookings(sorted);
        setFilteredBookings(sorted);
      })
      .catch((err) => {
        console.error("Error loading bookings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard">
      <DashboardHeader />

      <main className="dashboard-main">
        <div className="dashboard-section">
          <RoomAnalytics />
        </div>

        <div className="dashboard-section card">
          <div className="section-header">
            <h2>Booking Calendar</h2>
          </div>

          {loading ? (
            <p>Loading bookings...</p>
          ) : (
            <BookingsCalendar bookings={bookings} />
          )}
        </div>

        <div className="dashboard-section card">
          <h2>Filters</h2>

          {loading ? (
            <p>Loading filters...</p>
          ) : (
            <BookingsFilter
              bookings={bookings}
              onFilterChange={setFilteredBookings}
            />
          )}
        </div>

        <div className="dashboard-section card">
          <h2>All Bookings ({filteredBookings.length})</h2>

          {loading ? (
            <p>Loading bookings...</p>
          ) : (
            <BookingsTable bookings={filteredBookings} />
          )}
        </div>
      </main>
    </div>
  );
}
