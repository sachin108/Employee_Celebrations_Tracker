from django.shortcuts import render
from .utils import calculate_upcoming_events

def upcoming_events(request, date_range):
    date_range = int(date_range)
    upcoming_birthdays, upcoming_work_anniversaries = calculate_upcoming_events(date_range)

    return render(request, 'upcoming_events.html', {
        'upcoming_birthdays': upcoming_birthdays,
        'upcoming_work_anniversaries': upcoming_work_anniversaries,
        'date_range': date_range,
    })
