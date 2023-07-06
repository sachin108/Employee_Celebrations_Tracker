from datetime import datetime, timedelta

def calculate_upcoming_events(employee_data, daysX):
    upcoming_birthdays = []
    upcoming_work_anniversaries = []

    today = datetime.today()

    for employee in employee_data:
        # Calculate days remaining for the upcoming birthday
        birthdate = employee.birthdate

        next_birthday = datetime(today.year, birthdate.month, birthdate.day)

        if next_birthday < today:
            next_birthday = datetime(today.year + 1, birthdate.month, birthdate.day)

        remaining_days = (next_birthday - today).days

        if remaining_days == 365:
            upcoming_birthdays.append({
                'name': employee.name,
                'birthdate': birthdate,
                'email': employee.email,
                'days_remaining': 0
            })

        if 0 <= remaining_days <= daysX:
            upcoming_birthdays.append({
                'name': employee.name,
                'birthdate': birthdate,
                'email': employee.email,
                'days_remaining': remaining_days
            })

        # Calculate days remaining for the upcoming work anniversary
        hire_date = employee.hire_date

        next_anniversary = datetime(today.year, hire_date.month, hire_date.day)

        if next_anniversary < today:
            next_anniversary = datetime(today.year + 1, hire_date.month, hire_date.day)


        remaining_days_anniversary = (next_anniversary - today).days

        print(employee.name, remaining_days_anniversary)
        if remaining_days_anniversary == 365:
            upcoming_work_anniversaries.append({
                'name': employee.name,
                'hire_date': hire_date,
                'email': employee.email,
                'days_remaining': 0
            })


        if 0 <= remaining_days_anniversary <= daysX:
            upcoming_work_anniversaries.append({
                'name': employee.name,
                'hire_date': hire_date,
                'email': employee.email,
                'days_remaining': remaining_days_anniversary
            })

    return upcoming_birthdays, upcoming_work_anniversaries
