from django.contrib import admin
from django.urls import path
from employee_data_service.views import upload_file, show_employee_data, upcoming_events, login_view, signup_view, logout_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('upload/', upload_file, name='upload'),
    path('upcoming-events/', upcoming_events, name='upcoming_events'),    
    path('employee_data/', show_employee_data,name='employee_data'),
    path('', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('logout/', logout_view, name='logout'),
]


