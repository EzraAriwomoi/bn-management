"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingsCalendar({ bookings }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));

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
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [startingDayOfWeek, daysInMonth]);

  const getBookingsForDate = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    return bookings.filter((booking) => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      return date >= checkIn && date < checkOut;
    });
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={previousMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <h3 className="text-lg font-semibold">{monthName}</h3>

        <Button variant="outline" size="sm" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-sm text-muted-foreground p-2"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const dayBookings = day ? getBookingsForDate(day) : [];
          const hasPaid = dayBookings.some(
            (b) => b.payment_status === "Paid"
          );
          const hasUnpaid = dayBookings.some(
            (b) => b.payment_status === "Unpaid"
          );

          return (
            <div
              key={index}
              className={`min-h-24 p-2 rounded-lg border text-sm ${
                day
                  ? "bg-card border-border hover:bg-muted/50 cursor-pointer"
                  : "bg-muted/30 border-transparent"
              } ${
                hasPaid && !hasUnpaid
                  ? "bg-green-50 dark:bg-green-950"
                  : ""
              } ${hasUnpaid ? "bg-red-50 dark:bg-red-950" : ""}`}
            >
              {day && (
                <>
                  <div className="font-semibold mb-1">{day}</div>

                  <div className="space-y-1">
                    {dayBookings.slice(0, 2).map((booking) => (
                      <div
                        key={booking.id}
                        className={`text-xs p-1 rounded truncate ${
                          booking.payment_status === "Paid"
                            ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100"
                        }`}
                        title={booking.guest_name}
                      >
                        {booking.guest_name.split(" ")[0]}
                      </div>
                    ))}

                    {dayBookings.length > 2 && (
                      <div className="text-xs text-muted-foreground">
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

      <div className="flex gap-4 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded border border-green-300" />
          <span>Paid</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 dark:bg-red-900 rounded border border-red-300" />
          <span>Unpaid</span>
        </div>
      </div>
    </div>
  );
}
