"use client";

import React from "react";
import "@/components/css/booking_details.css";
import { X, CheckCircle } from "lucide-react";

/* ================= HOUSE → IMAGE MAP ================= */
const HOUSE_IMAGES = {
  "B1-3": "/rooms/B13.jpeg",
  "B2-7": "/rooms/B27.jpeg",
  "B2-8": "/rooms/B28.jpeg",
  "B3-10": "/rooms/B310.jpeg",
  "B7-7": "/rooms/B77.jpeg",
  A4: "/rooms/A4.jpeg",
  "1B": "/rooms/1B.jpeg",
};

export function BookingDetailsModal({ booking, onClose }) {
  if (!booking) return null;

  /* ================= HELPERS ================= */

  const toNumber = (v) => Number(v ?? 0);

  const formatKES = (v) => `KES ${toNumber(v).toLocaleString()}`;

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

  const nights = booking.nights ?? 0;

  const nightlyRate = nights > 0 ? toNumber(booking.amount) / nights : 0;

  const balance = toNumber(booking.balance);

  const paymentStatus =
    balance <= 0 ? "Paid" : booking.amount_paid > 0 ? "Partial" : "Unpaid";

  /* ================= UI ================= */

  return (
    <div className="reservation-backdrop" onClick={onClose}>
      <div className="reservation-modal" onClick={(e) => e.stopPropagation()}>
        {/* ================= HEADER ================= */}
        <div className="reservation-header">
          <h2>Booking Details</h2>

          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* ================= TOP SECTION ================= */}
        <div className="reservation-top">
          {/* ROOM IMAGE */}
          <div className="room-preview">
            <img
              src={HOUSE_IMAGES[booking.house] || "/rooms/default.jpg"}
              alt={booking.house}
              className="room-image"
            />

            <div className="room-badge">Unit {booking.house}</div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="summary-grid">
            {/* TOTAL CHARGED */}
            <div className="summary-card">
              <div className="summary-title">Total charged</div>

              <div className="summary-amount">{formatKES(booking.amount)}</div>

              <div className="summary-row">
                <span>Nightly rate</span>
                <span>{formatKES(nightlyRate)}</span>
              </div>

              <div className="summary-row">
                <span>Nights</span>
                <span>{nights}</span>
              </div>
            </div>

            {/* TOTAL PAYOUT */}
            <div className="summary-card">
              <div className="summary-title">Payment summary</div>

              <div className="summary-amount">
                {formatKES(booking.amount_paid)}
              </div>

              <div className="summary-row">
                <span>Status</span>
                <span
                  className={
                    paymentStatus === "Paid" ? "amount-paid" : "amount-due"
                  }
                >
                  {paymentStatus}
                </span>
              </div>

              <div className="summary-row">
                <span>Balance</span>
                <span className={balance > 0 ? "amount-due" : "amount-paid"}>
                  {formatKES(balance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DETAILS SECTION ================= */}
        <div className="reservation-body">
          <div className="details-cards">
            {/* ================= GUEST CARD ================= */}
            <div className="details-card">
              <div className="details-card-title">Guest Details</div>

              <Row label="Guest" value={booking.guest_name || "-"} />

              <Row label="Check-in" value={formatDate(booking.check_in)} />

              <Row label="Guests" value={booking.guests ?? 1} />

              <Row label="Platform" value={booking.platform || "-"} />

              {/* Agent Info */}
              {booking.platform?.toLowerCase() === "agent" && (
                <>
                  <Row label="Agent Name" value={booking.agent_name || "-"} />
                  <Row
                    label="Agent Contact"
                    value={booking.agent_contact || "-"}
                  />
                </>
              )}

              <Row
                label="Payment date"
                value={formatDate(booking.payment_date)}
              />
            </div>

            {/* ================= BOOKING CARD ================= */}
            <div className="details-card">
              <div className="details-card-title">Booking Details</div>

              <Row label="Booking ID" value={booking.booking_id} />

              <Row label="Check-out" value={formatDate(booking.check_out)} />

              <Row label="Nights" value={nights} />

              <div className="row">
                <span>Stay status</span>
                <span className="status-confirmed">
                  <CheckCircle size={16} />
                  {booking.stay_status}
                </span>
              </div>
            </div>
          </div>

          {/* NOTES */}
          {booking.notes && (
            <>
              <div className="section-title">Notes</div>
              <p className="notes">{booking.notes}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE ROW ================= */
function Row({ label, value }) {
  return (
    <div className="row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
