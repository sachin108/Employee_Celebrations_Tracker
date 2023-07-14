from datetime import datetime, timedelta

def calculate_upcoming_events(employee_data):
    upcoming_birthdays = []
    upcoming_work_anniversaries = []

    today = datetime.today()

    for employee in employee_data:
        # Calculate days remaining for the upcoming birthday
        dob = employee.dob

        next_birthday = datetime(today.year, dob.month, dob.day)

        if next_birthday < today:
            next_birthday = datetime(today.year + 1, dob.month, dob.day)

        remaining_days = (next_birthday - today).days

        if remaining_days == 365:
            upcoming_birthdays.append({
                'name': employee.name,
                'dob': dob,
                'email': employee.email,
                'days_remaining': 0,
                "fc":employee.fc,
                "ff":employee.ff
            })

        if 0 <= remaining_days <= 30:
            upcoming_birthdays.append({
                'name': employee.name,
                'dob': dob,
                'email': employee.email,
                'days_remaining': remaining_days,
                "fc":employee.fc,
                "ff":employee.ff
            })

        # Calculate days remaining for the upcoming work anniversary
        doj = employee.doj

        next_anniversary = datetime(today.year, doj.month, doj.day)

        if next_anniversary < today:
            next_anniversary = datetime(today.year + 1, doj.month, doj.day)

        total_years=(today.year - doj.year)
        remaining_days_anniversary = (next_anniversary - today).days

        print(employee.name, remaining_days_anniversary)
        if remaining_days_anniversary == 365:
            upcoming_work_anniversaries.append({
                'name': employee.name,
                'doj': doj,
                'email': employee.email,
                'days_remaining': 0,
                "total_years":total_years,
                "fc":employee.fc,
                "ff":employee.ff
            })


        if 0 <= remaining_days_anniversary <= 30:
            upcoming_work_anniversaries.append({
                'name': employee.name,
                'doj': doj,
                'email': employee.email,
                'days_remaining': remaining_days_anniversary,
                "total_years":total_years,
                "ff":employee.ff
            })

    return upcoming_birthdays, upcoming_work_anniversaries
