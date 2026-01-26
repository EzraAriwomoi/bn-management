"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import "@/components/css/bookings_filter.css";

const ROOMS = [
  { value: "B1-3", label: "B1-3 (Studio)" },
  { value: "B2-8", label: "B2-8 (Studio)" },
  { value: "B3-10", label: "B3-10 (Studio)" },
  { value: "B7-7", label: "B7-7 (Studio)" },
  { value: "A4", label: "A4 (1 Bedroom)" },
  { value: "A5", label: "A5 (1 Bedroom)" },
  { value: "G3", label: "G3 (1 Bedroom)" },
  { value: "1B", label: "1B (1 Bedroom)" },
];

export function BookingsFilter({ bookings, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [stayStatusFilter, setStayStatusFilter] = useState("all");
  const [houseFilter, setHouseFilter] = useState("all");

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.guest_name.toLowerCase().includes(term) ||
          booking.booking_id.toLowerCase().includes(term) ||
          (booking.agent_name?.toLowerCase().includes(term) ?? false),
      );
    }

    if (platformFilter !== "all")
      filtered = filtered.filter((b) => b.platform === platformFilter);
    if (paymentFilter !== "all")
      filtered = filtered.filter((b) => b.payment_status === paymentFilter);
    if (stayStatusFilter !== "all")
      filtered = filtered.filter((b) => b.stay_status === stayStatusFilter);
    if (houseFilter !== "all")
      filtered = filtered.filter((b) => b.house === houseFilter);

    onFilterChange(filtered);
  };

  useEffect(() => {
    filterBookings();
  }, [
    searchTerm,
    platformFilter,
    paymentFilter,
    stayStatusFilter,
    houseFilter,
  ]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setPlatformFilter("all");
    setPaymentFilter("all");
    setStayStatusFilter("all");
    setHouseFilter("all");
    onFilterChange(bookings);
  };

  const isFiltered =
    searchTerm !== "" ||
    platformFilter !== "all" ||
    paymentFilter !== "all" ||
    stayStatusFilter !== "all" ||
    houseFilter !== "all";

  return (
    <div className="bookings-filter">
      {/* Search */}
      <div className="filter-search">
        <label>Search</label>
        <div className="search-inputs">
          <Input
            placeholder="Search by guest, booking ID, or agent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-field"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="filter-grid">
        <div className="filter-item">
          <label>Platform</label>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="Airbnb">Airbnb</option>
            <option value="Booking.com">Booking.com</option>
            <option value="Agent">Agent</option>
            <option value="Direct">Direct</option>
          </select>
        </div>

        <div className="filter-item">
          <label>House</label>
          <select
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)}
          >
            <option value="all">All Houses</option>
            {ROOMS.map((room) => (
              <option key={room.value} value={room.value}>
                {room.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Payment Status</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Stay Status</label>
          <select
            value={stayStatusFilter}
            onChange={(e) => setStayStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {isFiltered && (
        <div className="clear-filters">
          <Button onClick={handleClearFilters} className="clear-button">
            <X className="clear-icon" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
