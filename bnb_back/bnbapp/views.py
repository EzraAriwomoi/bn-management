import calendar
from datetime import date, timedelta
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, F, ExpressionWrapper, DurationField, Q
from django.db.models.functions import Greatest, Least

from .models import Room, Booking
from .serializers import RoomSerializer, BookingSerializer

class RoomViewSet(viewsets.ModelViewSet):
    serializer_class = RoomSerializer

    queryset = Room.objects.all()
    def get_queryset(self):
        return Room.objects.filter(is_active=True)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

class RoomMetricsView(APIView):
    def get(self, request):
        period = request.query_params.get("period", "today")
        today = date.today()

        # Default values
        start = today
        end = today + timedelta(days=1)

        if period == "today":
            start = today
            end = today + timedelta(days=1)

        elif period == "week":
            start = today - timedelta(days=6)
            end = today + timedelta(days=1)

        elif period == "month":
            # Start of current month
            start = today.replace(day=1)
            # Find last day of current month, then add 1 day to get start of next month
            last_day = calendar.monthrange(today.year, today.month)[1]
            end = start + timedelta(days=last_day)

        elif period == "lastMonth":
            # First day of this month
            first_this_month = today.replace(day=1)
            # Last day of last month
            end = first_this_month
            # First day of last month
            last_month_date = first_this_month - timedelta(days=1)
            start = last_month_date.replace(day=1)
            
        else:
            return Response({"error": "Invalid period"}, status=400)

        # Expression to calculate the number of nights booked within the period
        # This calculates: min(checkout, end) - max(checkin, start)
        occupied_expr = ExpressionWrapper(
            Greatest(
                timedelta(0),
                Least(F("check_out"), end) - Greatest(F("check_in"), start)
            ),
            output_field=DurationField()
        )

        # Aggregate metrics per room (grouped by the 'house' field)
        metrics = (
            Booking.objects
            .values("house")
            .annotate(
                occupied_nights=Sum(occupied_expr),
                revenue=Sum(
                    "amount",
                    filter=Q(payment_status="Paid", payment_date__range=(start, end - timedelta(days=1)))
                )
            )
        )

        # Calculate total days in the period for the denominator (frontend display)
        total_days_in_period = (end - start).days

        # Format the response
        response_data = [
            {
                "room": m["house"],
                "occupied_nights": int(m["occupied_nights"].total_seconds() // 86400) if m["occupied_nights"] else 0,
                "total_days_in_period": total_days_in_period, # Use this for your '31' denominator
                "revenue": float(m["revenue"]) if m["revenue"] else 0.0,
            }
            for m in metrics
        ]

        return Response(response_data)