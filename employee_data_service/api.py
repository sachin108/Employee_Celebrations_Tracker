from django.http import JsonResponse
from date_calculation_service.utils import calculate_upcoming_events
from .models import Employee

def upcoming_events_api(request, days):

    # Retrieve the employee data from the database
    employee_data = Employee.objects.all()

    # Calculate upcoming events using the utility function from date_calculation_service
    upcoming_birthdays, upcoming_work_anniversaries = calculate_upcoming_events(employee_data, days)

    # Prepare the data as JSON
    data = {
        'upcoming_birthdays': upcoming_birthdays,
        'upcoming_work_anniversaries': upcoming_work_anniversaries,
    }

    # Return the JSON response
    return JsonResponse(data)
