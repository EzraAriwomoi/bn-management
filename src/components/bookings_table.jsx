"use client";

import { useState, useEffect } from "react";
import "@/components/css/bookings_table.css";

const API_BASE = "http://127.0.0.1:8000/api";

export function BookingsTable() {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH BOOKINGS ---------------- */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/bookings/`);
        const data = await res.json();

        // Sort by most recent (created_at → check_in fallback)
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.created_at || a.check_in);
          const dateB = new Date(b.created_at || b.check_in);
          return dateB - dateA;
        });

        setBookingsList(sorted);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  /* ---------------- BADGES ---------------- */
  const getPaymentColor = (status) => {
    switch (status) {
      case "Paid":
        return "badge-paid";
      case "Unpaid":
        return "badge-unpaid";
      default:
        return "badge-default";
    }
  };

  const getStayColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "badge-upcoming";
      case "Ongoing":
        return "badge-ongoing";
      case "Completed":
        return "badge-completed";
      case "Cancelled":
        return "badge-cancelled";
      default:
        return "badge-default";
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return <div className="loading">Loading bookings…</div>;
  }

  return (
    <div className="table-container">
      <table className="bookings-table">
        <thead>
          <tr className="table-header">
            <th>Booking ID</th>
            <th>Guest</th>
            <th>House</th>
            <th>Platform</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Nights</th>
            <th className="text-right">Amount</th>
            <th>Payment</th>
            <th>Stay Status</th>
            <th>Notes</th>
          </tr>
        </thead>

        <tbody>
          {bookingsList.length === 0 ? (
            <tr>
              <td colSpan={11} className="no-bookings">
                No bookings found.
              </td>
            </tr>
          ) : (
            bookingsList.map((booking) => (
              <tr key={booking.id} className="table-row">
                <td>{booking.booking_id}</td>

                <td>
                  <div className="guest-info">
                    <div className="guest-name">{booking.guest_name}</div>
                    {booking.agent_name && (
                      <div className="agent-name">
                        Agent: {booking.agent_name}
                      </div>
                    )}
                  </div>
                </td>

                <td>{booking.house}</td>
                <td>{booking.platform}</td>
                <td>{new Date(booking.check_in).toLocaleDateString()}</td>
                <td>{new Date(booking.check_out).toLocaleDateString()}</td>
                <td className="text-center">{booking.nights}</td>

                <td className="text-right font-semibold">
                  KES {Number(booking.amount).toLocaleString()}
                </td>

                <td>
                  <span
                    className={`badge ${getPaymentColor(
                      booking.payment_status
                    )}`}
                  >
                    {booking.payment_status}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge ${getStayColor(booking.stay_status)}`}
                  >
                    {booking.stay_status}
                  </span>
                </td>

                <td className="notes">{booking.notes || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
