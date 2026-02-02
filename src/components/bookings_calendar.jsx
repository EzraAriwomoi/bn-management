"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/components/css/bookings_calendar.css";

export function BookingsCalendar({ bookings }) {
  // Start calendar at current month instead of hardcoded Jan
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [startingDayOfWeek, daysInMonth]);

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getBookingsForDate = (day) => {
    if (!day) return [];

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    date.setHours(0, 0, 0, 0);

    return bookings.filter((booking) => {
      const checkIn = normalizeDate(booking.check_in);
      const checkOut = normalizeDate(booking.check_out);

      // Guest occupies the room for nights:
      // check-in INCLUDED, check-out EXCLUDED
      return date >= checkIn && date < checkOut;
    });
  };

  const previousMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  return (
    <div className="bookings-calendar">
      <div className="calendar-header">
        <Button onClick={previousMonth} size="sm" variant="outline">
          <ChevronLeft />
        </Button>
        <h3>{monthName}</h3>
        <Button onClick={nextMonth} size="sm" variant="outline">
          <ChevronRight />
        </Button>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const dayBookings = getBookingsForDate(day);

          const hasPaid = dayBookings.some(
            (b) => b.payment_status === "Paid"
          );
          const hasUnpaid = dayBookings.some(
            (b) => b.payment_status === "Unpaid"
          );

          let dayClass = "calendar-day";
          if (!day) dayClass += " calendar-day-disabled";
          else if (hasPaid && !hasUnpaid) dayClass += " calendar-day-paid";
          else if (hasUnpaid) dayClass += " calendar-day-unpaid";

          return (
            <div key={index} className={dayClass}>
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  <div className="bookings-list">
                    {dayBookings.slice(0, 2).map((booking) => (
                      <div
                        key={booking.id}
                        className={
                          booking.payment_status === "Paid"
                            ? "booking-label booking-paid"
                            : "booking-label booking-unpaid"
                        }
                        title={booking.guest_name}
                      >
                        {booking.guest_name.split(" ")[0]}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="more-bookings">
                        +{dayBookings.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color legend-paid"></div>
          <span>Paid</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-unpaid"></div>
          <span>Unpaid</span>
        </div>
      </div>
    </div>
  );
}
