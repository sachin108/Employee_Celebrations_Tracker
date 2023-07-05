from datetime import date, timedelta
from employee_data_service.models import Employee


def calculate_upcoming_events(date_range):
    employees = Employee.objects.all()
    today = date.today()
    end_date = today + timedelta(days=date_range)

    upcoming_birthdays = []
    upcoming_anniversaries = []

    for employee in employees:
        # Calculate the upcoming birthday for each employee
        birthdate = employee.birthdate
        upcoming_birthday = date(today.year, birthdate.month, birthdate.day)

        if upcoming_birthday < today:
            upcoming_birthday = date(today.year + 1, birthdate.month, birthdate.day)

        if today <= upcoming_birthday <= end_date:
            days_until_birthday = (upcoming_birthday - today).days
            upcoming_birthdays.append({'employee': employee, 'days_until': days_until_birthday})
            
        # Calculate the upcoming work anniversary for each employee
        hire_date = employee.hire_date
        upcoming_anniversary = date(today.year, hire_date.month, hire_date.day)

        if upcoming_anniversary < today:
            upcoming_anniversary = date(today.year + 1, hire_date.month, hire_date.day)

        if today <= upcoming_anniversary <= end_date:
            days_until_anniversary = (upcoming_anniversary - today).days
            upcoming_anniversaries.append({'employee': employee, 'days_until': days_until_anniversary})

    return upcoming_birthdays, upcoming_anniversaries
