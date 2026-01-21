"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingForm } from "./booking_form";

export function EditBookingDialog({
  booking,
  open,
  onOpenChange,
  onSuccess,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
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
