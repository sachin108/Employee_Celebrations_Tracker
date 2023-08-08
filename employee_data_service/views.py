from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render, redirect, get_object_or_404
import pandas as pd
from .models import Employee
from .utils import calculate_upcoming_events
from .forms import EmployeeForm
from django.db.models import Q
from elasticapm import capture_span


date_format="%Y-%m-%d"  

@login_required(login_url='login')
@user_passes_test(lambda u: u.is_superuser)
def upload_file(request):
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


@capture_span("my_custom_transaction", "custom")
@login_required(login_url='login')
@user_passes_test(lambda u: u.is_superuser)
def show_employee_data(request):
    employee_data = Employee.objects.all()
    return render(request, 'employee_data.html', {'employee_data': employee_data})

@login_required(login_url='login')
@user_passes_test(lambda u: u.is_superuser)
def search_employees(request):
    query = request.GET.get('q')
    if query:
        employees = Employee.objects.filter(
            Q(name__icontains=query) | Q(dept__icontains=query))
    else:
        employees = Employee.objects.all()
    
    return render(request, 'employee_search.html', {'employees': employees, 'query': query})

@capture_span("my_custom_transactio", "custo")
@login_required(login_url='login')
def upcoming_events(request):
    depts = request.GET.getlist('dept')  
    employee_data = Employee.objects.all() 
    upcoming_events = calculate_upcoming_events(employee_data, depts)
    return render(request, 'upcoming-events.html',  {'employee_data': employee_data, 'upcoming_events': upcoming_events})


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
            return render(request, 'login.html', {'error_message': 'User does not exist!'})
    else:
        return render(request, 'login.html')

def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        if User.objects.filter(username=username).exists():
            error_message = 'Username not available'
            return render(request, 'signup.html', {'error_message': error_message})
        else:        
            user = User.objects.create_user(username=username, email=email, password=password)
        return redirect('login') 
    else:
        return render(request, 'signup.html')

def logout_view(request):
    logout(request)
    return redirect('login') 

@login_required(login_url='login')
@user_passes_test(lambda u: u.is_superuser)
def edit_employee(request, eId):
    employee = get_object_or_404(Employee, eId=eId)

    if request.method == 'POST':
        form = EmployeeForm(request.POST, instance=employee)
        if form.is_valid():
            form.save()
            return redirect('employee_data') 
    else:
        form = EmployeeForm(instance=employee)

    return render(request, 'edit_employee.html', {'form': form, 'employee': employee})





















