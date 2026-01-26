"use client";

import { useState } from "react";
import { DashboardHeader } from "./components/dashboard_header";
import { BookingsCalendar } from "./components/bookings_calendar";
import { BookingsTable } from "./components/bookings_table";
import { BookingsFilter } from "./components/bookings_filter";
import { AddBookingDialog } from "./components/add_booking_dialog";
import { RoomAnalytics } from "./components/room_analytics";
import { mockBookings } from "../src/lib/mock_bookings";

import "@/components/css/dashboard.css";

export function DashboardClient() {
  const [filteredBookings, setFilteredBookings] = useState(mockBookings);

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
            <AddBookingDialog />
          </div>
          <BookingsCalendar bookings={mockBookings} />
        </div>

        <div className="dashboard-section card">
          <h2>Filters</h2>
          <BookingsFilter
            bookings={mockBookings}
            onFilterChange={setFilteredBookings}
          />
        </div>

        <div className="dashboard-section card">
          <h2>All Bookings ({filteredBookings.length})</h2>
          <BookingsTable bookings={filteredBookings} />
        </div>
      </main>
    </div>
  );
}
