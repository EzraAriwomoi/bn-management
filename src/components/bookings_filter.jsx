"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// BookingsFilter props: bookings = array of booking objects, onFilterChange = callback
export function BookingsFilter({ bookings, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [stayStatusFilter, setStayStatusFilter] = useState("all");

  const filterBookings = () => {
    let filtered = bookings;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.guest_name.toLowerCase().includes(term) ||
          booking.booking_id.toLowerCase().includes(term) ||
          (booking.agent_name?.toLowerCase().includes(term) ?? false)
      );
    }

    // Platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter((booking) => booking.platform === platformFilter);
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter((booking) => booking.payment_status === paymentFilter);
    }

    // Stay status filter
    if (stayStatusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.stay_status === stayStatusFilter);
    }

    onFilterChange(filtered);
  };

  const handleSearch = () => {
    filterBookings();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setPlatformFilter("all");
    setPaymentFilter("all");
    setStayStatusFilter("all");
    onFilterChange(bookings);
  };

  const isFiltered =
    searchTerm !== "" || platformFilter !== "all" || paymentFilter !== "all" || stayStatusFilter !== "all";

  return (
    <div className="space-y-3 sm:space-y-4 bg-muted/30 p-3 sm:p-4 md:p-6 rounded-lg border border-border">
      {/* Search Input */}
      <div>
        <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">Search</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search by guest, booking ID, or agent..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value === "") filterBookings();
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 text-sm"
          />
          <Button onClick={handleSearch} className="px-4 sm:px-6 w-full sm:w-auto">
            Search
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Platform Filter */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">Platform</label>
          <select
            value={platformFilter}
            onChange={(e) => {
              setPlatformFilter(e.target.value);
              filterBookings();
            }}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            <option value="all">All Platforms</option>
            <option value="Airbnb">Airbnb</option>
            <option value="Booking.com">Booking.com</option>
            <option value="Agent">Agent</option>
            <option value="Direct">Direct</option>
          </select>
        </div>

        {/* Payment Filter */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">Payment Status</label>
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              filterBookings();
            }}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Stay Status Filter */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">Stay Status</label>
          <select
            value={stayStatusFilter}
            onChange={(e) => {
              setStayStatusFilter(e.target.value);
              filterBookings();
            }}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            <option value="all">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {isFiltered && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center gap-2 bg-transparent text-xs sm:text-sm"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
