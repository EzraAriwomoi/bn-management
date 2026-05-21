"use client";

import { useEffect, useState } from "react";
import { BookingsFilter } from "./BookingsFilter";
import { BookingsTable } from "./BookingsTable";

const API_BASE = "http://127.0.0.1:8000/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/bookings/`);
        const data = await res.json();

        const sorted = [...data].sort((a, b) => {
          const dateA = new Date(a.created_at || a.check_in || 0);
          const dateB = new Date(b.created_at || b.check_in || 0);
          return dateB - dateA;
        });

        setBookings(sorted);
        setFilteredBookings(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="loading">Loading bookings…</div>;

  return (
    <>
      <BookingsFilter
        bookings={bookings}
        onFilterChange={setFilteredBookings}
      />

      <BookingsTable bookings={filteredBookings} />
    </>
  );
}