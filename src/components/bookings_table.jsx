"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { EditBookingDialog } from "./edit_booking_dialog";

export function BookingsTable({ bookings }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [bookingsList, setBookingsList] = useState(bookings);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      console.log("Booking deleted (implement backend):", id);
      setBookingsList(bookingsList.filter((b) => b.id !== id));
      alert(
        "Booking deleted! Note: This is frontend-only. Connect your backend to persist changes."
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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "Unpaid":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const getStayColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "Ongoing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  return (
    <>
      <div className="overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Booking ID</TableHead>
              <TableHead>Guest Name</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Check-In</TableHead>
              <TableHead>Check-Out</TableHead>
              <TableHead>Nights</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Stay Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookingsList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center text-muted-foreground py-8"
                >
                  No bookings yet. Add one to get started!
                </TableCell>
              </TableRow>
            ) : (
              bookingsList.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {booking.booking_id}
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.guest_name}</div>
                      {booking.agent_name && (
                        <div className="text-xs text-muted-foreground">
                          Agent: {booking.agent_name}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>{booking.platform}</TableCell>

                  <TableCell>
                    {new Date(booking.check_in).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    {new Date(booking.check_out).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-center">
                    {booking.nights}
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    ₹{booking.amount.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <Badge className={getPaymentColor(booking.payment_status)}>
                      {booking.payment_status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge className={getStayColor(booking.stay_status)}>
                      {booking.stay_status}
                    </Badge>
                  </TableCell>

                  <TableCell className="max-w-xs truncate text-sm">
                    {booking.notes}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(booking)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(booking.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedBooking && (
        <EditBookingDialog
          booking={selectedBooking}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSuccess={() => {
            setIsEditOpen(false);
            alert(
              "Booking updated! Note: This is frontend-only. Connect your backend to persist changes."
            );
          }}
        />
      )}
    </>
  );
}
