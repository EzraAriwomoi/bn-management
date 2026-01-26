"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking_form";
import "@/components/css/edit_booking_dialog.css";

export function EditBookingDialog({ booking, open, onOpenChange, onSuccess }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="edit-dialog-content">
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogDescription>
            Update the booking details below
          </DialogDescription>
        </DialogHeader>

        <BookingForm initialData={booking} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
