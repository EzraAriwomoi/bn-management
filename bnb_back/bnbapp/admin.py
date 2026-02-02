from django.contrib import admin
from .models import Room, Booking

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'room_type', 'max_occupancy')
    list_filter = ('room_type',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'guest_name', 'platform', 'house', 'check_in', 'check_out', 'amount', 'payment_status', 'stay_status')
    list_filter = ('platform', 'payment_status', 'stay_status', 'house')
    search_fields = ('booking_id', 'guest_name', 'agent_name', 'house')
