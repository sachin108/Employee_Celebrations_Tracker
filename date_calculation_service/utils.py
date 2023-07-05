from datetime import datetime, timedelta

def calculate_upcoming_events(employee_data, days):
    upcoming_birthdays = []
    upcoming_work_anniversaries = []

    for employee in employee_data:

        # Calculate days remaining for the upcoming birthday
        birthdate = employee.birthdate

        today = datetime.today()
        next_birthday = datetime(today.year, birthdate.month, birthdate.day)

        if next_birthday < today:
            next_birthday = datetime(today.year + 1, birthdate.month, birthdate.day)

        remaining_days = (next_birthday - today).days

        '''
                # Adjust the birthdate to the next year if it has already passed for this year
                if birthdate < end_date:
                    birthdate = birthdate.replace(year=end_date.year + 1)

                #days_until_birthday = ((birthdate - end_date).days) 

                days_until_birthday = ((birthdate - end_date).days)-365 
        '''        
        if 0 <= remaining_days <= 30:
            upcoming_birthdays.append({
                'name': employee.name,
                'birthdate': birthdate,
                'email': employee.email,
                'days_remaining': remaining_days
            })

        # Calculate days remaining for the upcoming work anniversary
        hire_date = employee.hire_date

        next_annie = datetime(today.year, hire_date.month, hire_date.day)
        remaining_days_annie = (next_annie - today).days

        if 0 <= remaining_days_annie <= 30:
            upcoming_work_anniversaries.append({
                'name': employee.name,
                'hire_date': hire_date,
                'email': employee.email,
                'days_remaining': remaining_days_annie
            })

    return upcoming_birthdays, upcoming_work_anniversaries
