from django.contrib import admin
from django.utils.html import format_html
from .models import Room, Booking


# ---------------- ROOM ADMIN ----------------
@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'room_type', 'max_occupancy')
    list_filter = ('room_type',)


# ---------------- BOOKING ADMIN ----------------
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = (
        'booking_id',
        'guest_name',
        'platform',
        'house',
        'check_in',
        'check_out',
        'amount_display',
        'amount_paid_display',
        'balance_display',
        'payment_status',
        'stay_status',
    )

    list_filter = (
        'platform',
        'payment_status',
        'stay_status',
        'house',
    )

    search_fields = (
        'booking_id',
        'guest_name',
        'agent_name',
        'house',
    )

    ordering = ('-created_at',)

    # ---------- DISPLAY METHODS ----------

    def amount_display(self, obj):
        return f"KES {obj.amount:,.0f}"
    amount_display.short_description = "Amount"

    def amount_paid_display(self, obj):
        value = f"KES {obj.amount_paid:,.0f}"
        return format_html(
            '<span style="color:green; font-weight:600;">{}</span>',
            value
        )
    amount_paid_display.short_description = "Paid"

    def balance_display(self, obj):
        value = f"KES {obj.balance:,.0f}"

        if obj.balance > 0:
            return format_html(
                '<span style="color:red; font-weight:700;">{}</span>',
                value
            )

        return format_html(
            '<span style="color:gray;">{}</span>',
            value
        )

    balance_display.short_description = "Balance"