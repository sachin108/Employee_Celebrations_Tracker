from datetime import datetime, timedelta

def calculate_upcoming_events(employee_data, end_date):
    upcoming_birthdays = []
    upcoming_work_anniversaries = []

    for employee in employee_data:
        # Calculate days remaining for the upcoming birthday
        birthdate = employee.birthdate

        # Adjust the birthdate to the next year if it has already passed for this year
        if birthdate < end_date:
            birthdate = birthdate.replace(year=end_date.year + 1)

        #days_until_birthday = ((birthdate - end_date).days) 

        days_until_birthday = ((birthdate - end_date).days)-365 
        print(days_until_birthday)
        if 0 <= days_until_birthday <= 30:
            upcoming_birthdays.append({
                'name': employee.name,
                'birthdate': birthdate,
                'email': employee.email,
                'days_remaining': days_until_birthday
            })

        # Calculate days remaining for the upcoming work anniversary
        hire_date = employee.hire_date
        days_until_anniversary = (hire_date - end_date).days

        if 0 <= days_until_anniversary <= 30:
            upcoming_work_anniversaries.append({
                'name': employee.name,
                'hire_date': hire_date,
                'email': employee.email,
                'days_remaining': days_until_anniversary
            })

    return upcoming_birthdays, upcoming_work_anniversaries
