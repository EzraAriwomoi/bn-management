"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import "@/components/css/booking_form.css";

export function BookingForm({ initialData, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    booking_id: initialData?.booking_id || "",
    guest_name: initialData?.guest_name || "",
    platform: initialData?.platform || "Airbnb",
    agent_name: initialData?.agent_name || "",
    agent_contact: initialData?.agent_contact || "",
    house: initialData?.house || "",
    check_in: initialData?.check_in || "",
    check_out: initialData?.check_out || "",
    amount: initialData?.amount?.toString() || "",
    payment_status: initialData?.payment_status || "Unpaid",
    stay_status: initialData?.stay_status || "Upcoming",
    notes: initialData?.notes || "",
  });

  const ROOMS = [
    { value: "B1-3", label: "B1-3" },
    { value: "B2-8", label: "B2-8" },
    { value: "B3-10", label: "B3-10" },
    { value: "B7-7", label: "B7-7" },
    { value: "A4", label: "A4" },
    { value: "A5", label: "A5" },
    { value: "G3", label: "G3" },
    { value: "1B", label: "1B" },
  ];

  const calculateNights = () => {
    if (formData.check_in && formData.check_out) {
      const checkIn = new Date(formData.check_in);
      const checkOut = new Date(formData.check_out);
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const nights = calculateNights();
      const payload = {
        ...formData,
        nights,
        amount: parseFloat(formData.amount),
        property_id: 1,
      };
      console.log("Booking data:", payload);
      await new Promise((res) => setTimeout(res, 500));
      alert(
        `Booking ${initialData ? "updated" : "created"} successfully! (Frontend demo)`,
      );
      onSuccess();
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save booking");
      setLoading(false);
    }
  };

  const nights = calculateNights();

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="grid-2-cols">
        <div className="form-group">
          <Label htmlFor="booking_id">Booking ID *</Label>
          <Input
            id="booking_id"
            value={formData.booking_id}
            onChange={(e) =>
              setFormData({ ...formData, booking_id: e.target.value })
            }
            placeholder="e.g., 001"
            required
            disabled={!!initialData}
          />
        </div>

        <div className="form-group">
          <Label htmlFor="guest_name">Guest Name *</Label>
          <Input
            id="guest_name"
            value={formData.guest_name}
            onChange={(e) =>
              setFormData({ ...formData, guest_name: e.target.value })
            }
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <Label htmlFor="house">Booked House *</Label>
          <Select
            value={formData.house}
            onValueChange={(value) =>
              setFormData({ ...formData, house: value })
            }
            required
          >
            <SelectTrigger id="house">
              <SelectValue placeholder="Select house" />
            </SelectTrigger>
            <SelectContent>
              {ROOMS.map((room) => (
                <SelectItem key={room.value} value={room.value}>
                  {room.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="form-group">
          <Label htmlFor="platform">Platform *</Label>
          <Select
            value={formData.platform}
            onValueChange={(value) =>
              setFormData({ ...formData, platform: value })
            }
          >
            <SelectTrigger id="platform">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Airbnb">Airbnb</SelectItem>
              <SelectItem value="Booking.com">Booking.com</SelectItem>
              <SelectItem value="Agent">Agent</SelectItem>
              <SelectItem value="Direct">Direct</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.platform === "Agent" && (
          <>
            <div className="form-group">
              <Label htmlFor="agent_name">Agent Name</Label>
              <Input
                id="agent_name"
                value={formData.agent_name}
                onChange={(e) =>
                  setFormData({ ...formData, agent_name: e.target.value })
                }
                placeholder="Agent Name"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="agent_contact">Agent Contact</Label>
              <Input
                id="agent_contact"
                value={formData.agent_contact}
                onChange={(e) =>
                  setFormData({ ...formData, agent_contact: e.target.value })
                }
                placeholder="Phone / Email"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <Label htmlFor="check_in">Check-In *</Label>
          <Input
            id="check_in"
            type="date"
            value={formData.check_in}
            onChange={(e) =>
              setFormData({ ...formData, check_in: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <Label htmlFor="check_out">Check-Out *</Label>
          <Input
            id="check_out"
            type="date"
            value={formData.check_out}
            onChange={(e) =>
              setFormData({ ...formData, check_out: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <Label>Nights (Auto)</Label>
          <Input value={nights} disabled className="disabled-input" />
        </div>

        <div className="form-group">
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <Label htmlFor="payment_status">Payment Status *</Label>
          <Select
            value={formData.payment_status}
            onValueChange={(value) =>
              setFormData({ ...formData, payment_status: value })
            }
          >
            <SelectTrigger id="payment_status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="form-group">
          <Label htmlFor="stay_status">Stay Status *</Label>
          <Select
            value={formData.stay_status}
            onValueChange={(value) =>
              setFormData({ ...formData, stay_status: value })
            }
          >
            <SelectTrigger id="stay_status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="form-group">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
        />
      </div>

      <div className="form-actions">
        <Button type="button" className="outline-button" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : initialData
              ? "Update Booking"
              : "Add Booking"}
        </Button>
      </div>
    </form>
  );
}
