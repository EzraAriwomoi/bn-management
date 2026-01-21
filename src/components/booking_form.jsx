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

export function BookingForm({ initialData, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    booking_id: initialData?.booking_id || "",
    guest_name: initialData?.guest_name || "",
    platform: initialData?.platform || "Airbnb",
    agent_name: initialData?.agent_name || "",
    agent_contact: initialData?.agent_contact || "",
    check_in: initialData?.check_in || "",
    check_out: initialData?.check_out || "",
    amount: initialData?.amount?.toString() || "",
    payment_status: initialData?.payment_status || "Unpaid",
    stay_status: initialData?.stay_status || "Upcoming",
    notes: initialData?.notes || "",
  });

  const calculateNights = () => {
    if (formData.check_in && formData.check_out) {
      const checkIn = new Date(formData.check_in);
      const checkOut = new Date(formData.check_out);
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) /
          (1000 * 60 * 60 * 24)
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

      console.log("Booking data to be saved:", payload);

      await new Promise((resolve) => setTimeout(resolve, 500));

      alert(
        `Booking ${
          initialData ? "updated" : "created"
        } successfully!\n\nNote: Frontend-only demo.`
      );

      onSuccess();
      setLoading(false);
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to save booking");
      setLoading(false);
    }
  };

  const nights = calculateNights();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="agent_name">Agent Name</Label>
              <Input
                id="agent_name"
                value={formData.agent_name}
                onChange={(e) =>
                  setFormData({ ...formData, agent_name: e.target.value })
                }
                placeholder="Agent name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent_contact">Agent Contact</Label>
              <Input
                id="agent_contact"
                value={formData.agent_contact}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    agent_contact: e.target.value,
                  })
                }
                placeholder="Phone/Email"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label>Nights (Auto)</Label>
          <Input value={nights} disabled className="bg-muted" />
        </div>

        <div className="space-y-2">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
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

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          rows={4}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onSuccess}>
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
