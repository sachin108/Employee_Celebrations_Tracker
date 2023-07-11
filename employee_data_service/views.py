from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
import pandas as pd
from datetime import date, timedelta
from .models import Employee
from .utils import calculate_upcoming_events

date_format = "%m/%d/%Y"  # Assuming the date format in the Excel sheet is MM/DD/YYYY

@login_required(login_url='login')
@user_passes_test(lambda u: u.is_superuser)
def upload_file(request):
    if request.method == 'POST':
        file = request.FILES['file']  # Assuming the file input field has the name 'file'

        # Check if the uploaded file is an Excel file
        if file.name.endswith('.xls') or file.name.endswith('.xlsx'):
            # Read the Excel file using pandas
            df = pd.read_excel(file)

            # Extract data from the Excel sheet
            for _, row in df.iterrows():
                eId=row['Employee_ID']
                name = row['Employee Name']
                email = row['Employee Email']
                dob=row['Date of Birth']
                dob=pd.to_datetime(dob, format=date_format)                
                doj = row['Date of Joining']
                doj=pd.to_datetime(doj, format=date_format)               
                fc=row['favourite Colour']
                fp=row['Place of interest']

                # Create Employee objects or perform any desired operations with the extracted data
                employee = Employee(eId=eId, name=name, dob=dob, doj=doj, email=email,fc=fc, fp=fp )
                employee.save()

            return render(request, 'employee_data.html', {'employee_data': Employee.objects.all()})
        else:
            return render(request, 'upload.html', {'error_message': 'Please upload a valid Excel file.'})
    else:
        return render(request, 'upload.html')


@login_required(login_url='login')
@user_passes_test(lambda u: u.is_superuser)
def show_employee_data(request):
    employee_data = Employee.objects.all()
    return render(request, 'employee_data.html', {'employee_data': employee_data})

@login_required(login_url='login')
def upcoming_events(request):
    # Retrieve the employee data from the database
    employee_data = Employee.objects.all()

    upcoming_birthdays, upcoming_work_anniversaries = calculate_upcoming_events(employee_data)
    return render(request, 'upcoming-events.html', {'upcoming_birthdays': upcoming_birthdays, 'upcoming_work_anniversaries': upcoming_work_anniversaries})

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if request.user.is_superuser:
                return render(request, 'adminX.html')
            else:
                return redirect('upcoming_events') 
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

