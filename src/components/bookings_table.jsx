"use client";

import { useState, useEffect } from "react";
import { EditBookingDialog } from "./edit_booking_dialog";
import { Edit2, Trash2 } from "lucide-react";
import "@/components/css/bookings_table.css";

export function BookingsTable({ bookings }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [bookingsList, setBookingsList] = useState(bookings);

  useEffect(() => {
    setBookingsList(bookings);
  }, [bookings]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      setBookingsList(bookingsList.filter((b) => b.id !== id));
      alert(
        "Booking deleted! Note: This is frontend-only. Connect your backend to persist changes.",
      );
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsEditOpen(true);
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "Paid":
        return "badge-paid";
      case "Unpaid":
        return "badge-unpaid";
      case "Pending":
        return "badge-pending";
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

  return (
    <>
      <div className="table-container">
        <table className="bookings-table">
          <thead>
            <tr className="table-header">
              <th>Booking ID</th>
              <th>Guest Name</th>
              <th>House</th>
              <th>Platform</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Nights</th>
              <th className="text-right">Amount</th>
              <th>Payment</th>
              <th>Stay Status</th>
              <th>Notes</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookingsList.length === 0 ? (
              <tr>
                <td colSpan={12} className="no-bookings">
                  No bookings found for these filters.
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
                  <td>{booking.house || "-"}</td>
                  <td>{booking.platform}</td>
                  <td>{new Date(booking.check_in).toLocaleDateString()}</td>
                  <td>{new Date(booking.check_out).toLocaleDateString()}</td>
                  <td className="text-center">{booking.nights}</td>
                  <td className="text-right font-semibold">
                    ₹{booking.amount.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`badge ${getPaymentColor(booking.payment_status)}`}
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
                  <td className="notes">{booking.notes}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleEdit(booking)}
                      className="action-btn"
                    >
                      <Edit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="action-btn delete"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <EditBookingDialog
          booking={selectedBooking}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSuccess={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
}
