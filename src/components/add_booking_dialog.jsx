"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking_form";

export function AddBookingDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="add-booking-btn">Add Booking</Button>
      </DialogTrigger>

      <DialogContent className="add-booking-dialog">
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
          <DialogDescription>Enter the booking details below</DialogDescription>
        </DialogHeader>

        <BookingForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
