from django.shortcuts import render
import pandas as pd
from datetime import date, timedelta

from .models import Employee
from .utils import calculate_upcoming_events

def upload_file(request):
    if request.method == 'POST':
        file = request.FILES['file']  # Assuming the file input field has the name 'file'

        # Check if the uploaded file is an Excel file
        if file.name.endswith('.xls') or file.name.endswith('.xlsx'):
            # Read the Excel file using pandas
            df = pd.read_excel(file)

            # Extract data from the Excel sheet
            for _, row in df.iterrows():
                name = row['Name']
                birthdate = row['Birth_Date']
                hire_date = row['Joining_Date']
                email = row['Email_ID']

                # Create Employee objects or perform any desired operations with the extracted data
                employee = Employee(name=name, birthdate=birthdate, hire_date=hire_date, email=email)
                employee.save()

            return render(request, 'employee_data.html', {'employee_data': Employee.objects.all()})
        else:
            return render(request, 'upload.html', {'error_message': 'Please upload a valid Excel file.'})
    else:
        return render(request, 'upload.html')

def show_employee_data(request):
    employee_data = Employee.objects.all()
    return render(request, 'employee_data.html', {'employee_data': employee_data})

def upcoming_events(request, days):
    # Retrieve the employee data from the database
    employee_data = Employee.objects.all()

    upcoming_birthdays, upcoming_work_anniversaries = calculate_upcoming_events(employee_data, days)
    print(upcoming_birthdays)
    return render(request, 'upcoming-events.html', {'upcoming_birthdays': upcoming_birthdays, 'upcoming_work_anniversaries': upcoming_work_anniversaries})

def index(request):
    return render(request, 'index.html')
