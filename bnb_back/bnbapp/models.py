from django.db import models
from django.utils import timezone
from decimal import Decimal


class Room(models.Model):
    ROOM_TYPE_CHOICES = [
        ('studio', 'Studio'),
        ('1bed', 'One Bedroom'),
    ]

    name = models.CharField(max_length=50)
    room_type = models.CharField(max_length=10, choices=ROOM_TYPE_CHOICES)
    max_occupancy = models.IntegerField(default=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Booking(models.Model):

    PLATFORMS = [
        ('Airbnb', 'Airbnb'),
        ('Booking.com', 'Booking.com'),
        ('Agent', 'Agent'),
        ('Direct', 'Direct'),
        ('Other', 'Other'),
    ]

    PAYMENT_STATUS = [
        ('Paid', 'Paid'),
        ('Unpaid', 'Unpaid'),
    ]

    STAY_STATUS = [
        ('Upcoming', 'Upcoming'),
        ('Ongoing', 'Ongoing'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    HOUSES = [
        ('B1-3', 'B1-3'),
        ('B2-7', 'B2-7'),
        # ('B2-8', 'B2-8'),
        ('B3-10', 'B3-10'),
        ('B5-6', 'B5-6'),
        ('B7-7', 'B7-7'),
        ('A4', 'A4'),
        # ('A5', 'A5'),
        # ('G3', 'G3'),
        ('1B', '1B'),
    ]

    booking_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        blank=True
    )

    guest_name = models.CharField(max_length=100)
    platform = models.CharField(max_length=20, choices=PLATFORMS, default='Airbnb')

    agent_name = models.CharField(max_length=100, blank=True, null=True)
    agent_contact = models.CharField(max_length=100, blank=True, null=True)

    house = models.CharField(max_length=20, choices=HOUSES, default='B1-3')

    check_in = models.DateField()
    check_out = models.DateField()
    nights = models.PositiveIntegerField(default=0)

    # ================= PAYMENT =================
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    amount_paid = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )

    balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        editable=False
    )

    payment_status = models.CharField(
        max_length=10,
        choices=PAYMENT_STATUS,
        default='Unpaid'
    )

    stay_status = models.CharField(
        max_length=10,
        choices=STAY_STATUS,
        default='Upcoming'
    )

    payment_date = models.DateField(blank=True, null=True)

    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

   # ================= SAVE LOGIC =================
    def save(self, *args, **kwargs):

        # Generate booking_id
        if not self.booking_id:
            today = timezone.now().date()
            yy = today.strftime("%y")
            mm = today.strftime("%m")
            dd = today.strftime("%d")

            # NEW PREFIX (no hyphen)
            prefix = f"RSLC{yy}{mm}{dd}"

            today_count = Booking.objects.filter(
                booking_id__startswith=prefix
            ).count() + 1

            self.booking_id = f"{prefix}{today_count:02d}"

        # Calculate nights
        if self.check_in and self.check_out:
            self.nights = (self.check_out - self.check_in).days

        # Calculate balance
        self.balance = Decimal(self.amount) - Decimal(self.amount_paid)

        # Auto payment status
        if self.balance <= 0:
            self.payment_status = 'Paid'
        else:
            self.payment_status = 'Unpaid'

        super().save(*args, **kwargs)

    # ================= PROPERTIES =================
    @property
    def per_night_amount(self):
        """Amount earned per night."""
        if self.nights > 0:
            return Decimal(self.amount) / Decimal(self.nights)
        return Decimal(self.amount)

    def revenue_on_date(self, target_date):
        """
        Revenue attributable to a specific date.
        """
        if self.payment_status != 'Paid':
            return Decimal('0')

        if self.check_in <= target_date < self.check_out:
            return self.per_night_amount

        return Decimal('0')

    def __str__(self):
        return f"{self.booking_id} - {self.guest_name}"