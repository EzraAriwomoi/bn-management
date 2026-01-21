"use client";

import { useState } from "react";
import { DashboardHeader } from "./components/dashboard_header";
import { BookingsCalendar } from "./components/bookings_calendar";
import { BookingsTable } from "./components/bookings_table";
import { BookingsFilter } from "./components/bookings_filter";
import { AddBookingDialog } from "./components/add_booking_dialog";
import { RoomAnalytics } from "./components/room_analytics";
import { mockBookings } from "../src/lib/mock_bookings";

export function DashboardClient() {
  const [filteredBookings, setFilteredBookings] = useState(mockBookings);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="space-y-6 sm:space-y-7 md:space-y-8">
          {/* Room Analytics Section */}
          <RoomAnalytics />

          {/* Calendar Section */}
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Booking Calendar</h2>
              <AddBookingDialog />
            </div>
            <BookingsCalendar bookings={mockBookings} />
          </div>

          {/* Filter Section */}
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4 md:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6">Filters</h2>
            <BookingsFilter bookings={mockBookings} onFilterChange={setFilteredBookings} />
          </div>

          {/* Bookings Table Section */}
          <div className="bg-card rounded-lg border border-border p-3 sm:p-4 md:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6">
              All Bookings ({filteredBookings.length})
            </h2>
            <BookingsTable bookings={filteredBookings} />
          </div>
        </div>
      </main>
    </div>
  )
}
