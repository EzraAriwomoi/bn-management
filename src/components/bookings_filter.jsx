"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import "@/components/css/bookings_filter.css";

export function BookingsFilter({ bookings, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [stayStatusFilter, setStayStatusFilter] = useState("all");
  const [houseFilter, setHouseFilter] = useState("all");

  const [rooms, setRooms] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  /* -------------------- FETCH FILTER OPTIONS -------------------- */
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/rooms/");
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        setRooms(data.map((r) => ({ value: r.name, label: r.name })));
      } catch (err) {
        console.error(err);
      }
    };

    const fetchPlatforms = async () => {
      try {
        // You could have a dedicated endpoint or infer platforms from bookings
        const uniquePlatforms = [...new Set(bookings.map((b) => b.platform))];
        setPlatforms(uniquePlatforms);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRooms();
    fetchPlatforms();
  }, [bookings]);

  /* -------------------- FILTER LOGIC -------------------- */
  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.guest_name.toLowerCase().includes(term) ||
          booking.booking_id.toLowerCase().includes(term) ||
          (booking.agent_name?.toLowerCase().includes(term) ?? false)
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
  }, [searchTerm, platformFilter, paymentFilter, stayStatusFilter, houseFilter]);

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

  /* -------------------- JSX -------------------- */
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
        {/* Platform Filter */}
        <div className="filter-item">
          <label>Platform</label>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <option value="all">All Platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* House Filter */}
        <div className="filter-item">
          <label>House</label>
          <select
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)}
          >
            <option value="all">All Houses</option>
            {rooms.map((room) => (
              <option key={room.value} value={room.value}>
                {room.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div className="filter-item">
          <label>Payment Status</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        {/* Stay Status Filter */}
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
