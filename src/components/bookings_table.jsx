"use client";

import { useState } from "react";
import { X } from "lucide-react";
import "@/components/css/bookings_table.css";
import "@/components/css/booking_details.css";
import { BookingDetailsModal } from "./booking_details";

export function BookingsTable({ bookings = [] }) {
  const [expandedNotes, setExpandedNotes] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null); // for modal

  const toggleNotes = (id, e) => {
    e.stopPropagation(); // Prevent row click when toggling notes
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openModal = (booking) => setSelectedBooking(booking);
  const closeModal = () => setSelectedBooking(null);

  const toNumber = (value) => Number(value ?? 0);
  const formatKES = (value) => `KES ${toNumber(value).toLocaleString()}`;
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  const getPaymentState = (booking) => {
    const balance = toNumber(booking.balance);
    const paid = toNumber(booking.amount_paid);
    if (balance <= 0) return { label: "Paid", className: "badge-paid" };
    if (paid > 0) return { label: "Partial", className: "badge-partial" };
    return { label: "Unpaid", className: "badge-unpaid" };
  };

  const getStayColor = (status) => {
    switch (status) {
      case "Upcoming": return "badge-upcoming";
      case "Ongoing": return "badge-ongoing";
      case "Completed": return "badge-completed";
      case "Cancelled": return "badge-cancelled";
      default: return "badge-default";
    }
  };

  const NOTE_LIMIT = 60;
  const renderNotes = (booking, e) => {
    const notes = booking.notes || "-";
    const isExpanded = expandedNotes[booking.id];
    if (notes.length <= NOTE_LIMIT) return notes;

    return (
      <>
        <span className={isExpanded ? "" : "collapsed"}>
          {isExpanded ? notes : notes.slice(0, NOTE_LIMIT)}
        </span>
        <button
          className="notes-toggle"
          onClick={(ev) => toggleNotes(booking.id, ev)}
        >
          {isExpanded ? " Show less" : "... Read more"}
        </button>
      </>
    );
  };

  return (
    <>
      {/* Bookings Table */}
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
              <th className="text-right">Paid</th>
              <th className="text-right">Balance</th>
              <th>Payment</th>
              <th>Stay Status</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={13} className="no-bookings">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const balance = toNumber(booking.balance);
                const payment = getPaymentState(booking);

                return (
                  <tr
                    key={booking.id}
                    className="table-row"
                    onClick={() => openModal(booking)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{booking.booking_id}</td>

                    {/* Guest + Agent */}
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
                    <td>{formatDate(booking.check_in)}</td>
                    <td>{formatDate(booking.check_out)}</td>
                    <td className="text-center">{booking.nights ?? 0}</td>
                    <td className="text-right font-semibold">{formatKES(booking.amount)}</td>
                    <td className="text-right text-green-600 font-medium">{formatKES(booking.amount_paid)}</td>
                    <td className={`text-right font-semibold ${balance > 0 ? "text-red-600" : "text-gray-400"}`}>
                      {formatKES(balance)}
                    </td>
                    <td><span className={`badge ${payment.className}`}>{payment.label}</span></td>
                    <td><span className={`badge ${getStayColor(booking.stay_status)}`}>{booking.stay_status}</span></td>

                    <td className="notes">{renderNotes(booking)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <BookingDetailsModal
  booking={selectedBooking}
  onClose={closeModal}
/>
    </>
  );
}