from django.shortcuts import render
from .utils import calculate_upcoming_events

def upcoming_events(request, date_range):

    # Call the calculate_upcoming_events function with the employees and date_range
    upcoming_birthdays, upcoming_anniversaries = calculate_upcoming_events( date_range)
    # Pass the calculated data to the template or perform any desired further actions
    return render(request, 'upcoming_events.html', {
        'upcoming_birthdays': upcoming_birthdays,
        'upcoming_anniversaries': upcoming_anniversaries
    })
