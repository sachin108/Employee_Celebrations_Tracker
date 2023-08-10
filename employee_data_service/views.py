from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from .models import Employee
from .utils import calculate_upcoming_events
from .forms import EmployeeForm
from django.db.models import Q
from elasticapm import capture_span
import pandas as pd
import logging

logger = logging.getLogger('mysite')
date_format="%Y-%m-%d"  

@login_required(login_url='login')
@user_passes_test(lambda u: u.is_superuser)
def upload_file(request):
    try:
        if request.method == 'POST':
            file = request.FILES['file']
            
            if file.name.endswith('.xls') or file.name.endswith('.xlsx'):
                df = pd.read_excel(file)

                for _, row in df.iterrows():
                    eId=row['Employee_ID']
                    name = row['Employee Name']
                    email = row['Employee Email']
                    dob=row['Date of Birth']
                    dob=pd.to_datetime(dob, format=date_format)                
                    doj = row['Date of Joining']
                    doj=pd.to_datetime(doj, format=date_format)               
                    fc=row['favourite Colour']
                    ff=row['favourite food']
                    dept=row['Department']

                    employee = Employee(eId=eId, name=name, dob=dob, doj=doj, email=email,fc=fc, ff=ff, dept=dept)
                    employee.save()

                return render(request, 'employee_data.html', {'employee_data': Employee.objects.all()})
            else:
                return render(request, 'upload.html', {'error_message': 'Please upload a valid Excel file.'})
        else:
            return render(request, 'upload.html')

    except Exception as e:
        logger.error(f"Error during file upload: {str(e)}", exc_info=True)
        # Handle the error gracefully, such as showing an error page or redirecting back to upload form
        return render(request, 'upload.html', {'error_message': 'An error occurred during file upload.'})

@login_required(login_url='login')
@user_passes_test(lambda u: u.is_superuser)
@capture_span("employee_data", "custom")
def show_employee_data(request):
    try:
        employee_data = Employee.objects.all()
        return render(request, 'employee_data.html', {'employee_data': employee_data})

    except Exception as e:
        logger.error(f"Error while fetching employee data: {str(e)}", exc_info=True)
        # Handle the error gracefully, such as showing an error page or redirecting to a safe state

        # For example, you can render an error template:
        return render(request, 'error.html', {'error_message': 'An error occurred while fetching employee data.'})


@login_required(login_url='login')
@user_passes_test(lambda u: u.is_superuser)
@capture_span("searching", "custom")
def search_employees(request):
    try:
        query = request.GET.get('q')
        if query:
            employees = Employee.objects.filter(
                Q(name__icontains=query) | Q(dept__icontains=query))
        else:
            employees = Employee.objects.all()
    
        return render(request, 'employee_search.html', {'employees': employees, 'query': query})

    except Exception as e:
        logger.error(f"Error during employee search: {str(e)}", exc_info=True)
        # Handle the error gracefully, such as showing an error page or redirecting back to search form
        return render(request, 'employee_search.html', {'error_message': 'An error occurred during employee search.'})
    

@capture_span("upcoming_events", "custo")
@login_required(login_url='login')
def upcoming_events(request):
    try:
        depts = request.GET.getlist('dept')  
        employee_data = Employee.objects.all() 
        upcoming_events = calculate_upcoming_events(employee_data, depts)

        # Log the number of upcoming events and the number of employees considered
        logger.info(f"Upcoming events calculated for {len(employee_data)} employees. Count of upcoming events: {len(employee_data)} employees. Count of upcoming events: {len(upcoming_events['upcoming_work_anniversaries'])+len(upcoming_events['upcoming_birthdays'])}")

        return render(request, 'upcoming-events.html', {'employee_data': employee_data, 'upcoming_events': upcoming_events})

    except Exception as e:
        logger.error(f"Error calculating upcoming events: {str(e)}", exc_info=True)
        # Handle the error gracefully, such as showing an error page or redirecting back to the previous page with an error message
        return render(request, 'error.html', {'error_message': 'An error occurred while calculating upcoming events.'})

@capture_span("login", "custom")
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                if request.user.is_superuser:
                    logger.info("Admin user logged in")
                    return render(request, 'adminX.html')
                else:
                    logger.info("Regular user logged in")
                    return redirect('upcoming_events') 
            else:
                logger.warning("User authentication failed for username: %s", username)
                return render(request, 'login.html', {'error_message': 'User does not exist!'})
        except Exception as e:
            logger.error("An error occurred during login: %s", str(e), exc_info=True)
            return HttpResponse("An error occurred during login.")
    else:
        return render(request, 'login.html')
    

def signup_view(request):
    try:
        if request.method == 'POST':
            username = request.POST.get('username')
            email = request.POST.get('email')
            password = request.POST.get('password')

            if User.objects.filter(username=username).exists():
                error_message = 'Username not available'
                return render(request, 'signup.html', {'error_message': error_message})
            else:
                user = User.objects.create_user(username=username, email=email, password=password)
                logger.info(f"User {user.username} signed up successfully")
            return redirect('login')
        else:
            return render(request, 'signup.html')

    except Exception as e:
        logger.error(f"Error during user signup: {str(e)}", exc_info=True)
        # Handle the error gracefully, such as showing an error page or redirecting back to signup form
        return render(request, 'signup.html', {'error_message': 'An error occurred during signup.'})

def logout_view(request):
    try:
        user = request.user.username
        logout(request)
        logger.info(f"User {user} logged out")
    except Exception as e:
        logger.error(f"Error logging out user {user}: {str(e)}", exc_info=True)    
    
    return redirect('login')


@login_required(login_url='login')
@user_passes_test(lambda u: u.is_superuser)
def edit_employee(request, eId):
    employee = get_object_or_404(Employee, eId=eId)

    try:
        if request.method == 'POST':
            form = EmployeeForm(request.POST, instance=employee)
            if form.is_valid():
                form.save()
                logger.info(f"Employee {employee.name} (ID: {employee.eId}) edited by {request.user.username}")
                return redirect('employee_data')
        else:
            form = EmployeeForm(instance=employee)

    except Exception as e:
        logger.error(f"Error editing employee (ID: {employee.eId}): {str(e)}", exc_info=True)

    return render(request, 'edit_employee.html', {'form': form, 'employee': employee})




















