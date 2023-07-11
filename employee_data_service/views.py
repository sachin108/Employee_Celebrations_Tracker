from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
import pandas as pd
from datetime import date, timedelta

from .models import Employee
from .utils import calculate_upcoming_events

@login_required(login_url='login')
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

@login_required(login_url='login')
def show_employee_data(request):
    employee_data = Employee.objects.all()
    return render(request, 'employee_data.html', {'employee_data': employee_data})

@login_required(login_url='login')
def upcoming_events(request, days):
    # Retrieve the employee data from the database
    employee_data = Employee.objects.all()

    upcoming_birthdays, upcoming_work_anniversaries = calculate_upcoming_events(employee_data, days)
    return render(request, 'upcoming-events.html', {'upcoming_birthdays': upcoming_birthdays, 'upcoming_work_anniversaries': upcoming_work_anniversaries})

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('upcoming_events', 30)  # Redirect to the upcoming events page for the next 30 days
        else:
            # Handle login failure (e.g., display an error message)
            return render(request, 'login.html', {'error_message': 'Invalid username or password'})
    else:
        return render(request, 'login.html')

def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        # Create a new user object
        user = User.objects.create_user(username=username, email=email, password=password)
        # Optionally, you can add additional fields to the User model or perform any other desired operations
        return redirect('login')  # Redirect to the login page after successful signup
    else:
        return render(request, 'signup.html')

def logout_view(request):
    logout(request)
    return redirect('login')  # Redirect to the login page after logout
