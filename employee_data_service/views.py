import pandas as pd
from django.shortcuts import render
from employee_data_service.models import Employee

def upload_file(request):
    if request.method == 'POST':
        file = request.FILES['file']  # Assuming the file input field has the name 'file'

        # Check if the uploaded file is an Excel file
        if file.name.endswith('.xls') or file.name.endswith('.xlsx'):
            # Read the Excel file using pandas
            df = pd.read_excel(file)

            # Extract data from the Excel sheet
            employee_data = []
            for _, row in df.iterrows():
                name = row['Name']
                birthdate = row['Birth_Date']
                hire_date = row['Joining_Date']
                email = row['Email_ID']

                # Create Employee objects from employee_data_service
                employee = Employee(name=name, birthdate=birthdate, hire_date=hire_date, email=email)
                employee.save()

                # Append the extracted data to a list
                employee_data.append({'name': name, 'birthdate': birthdate, 'hire_date': hire_date, 'email': email})

            # Pass the extracted data to the template or perform any desired further actions
            return render(request, 'result.html', {'employee_data': employee_data})
        else:
            return render(request, 'upload.html', {'error_message': 'Please upload a valid Excel file.'})
    else:
        return render(request, 'upload.html')
