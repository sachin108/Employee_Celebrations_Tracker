from django.contrib import admin
from django.urls import path
from employee_data_service.views import upload_file, show_employee_data, upcoming_events, login_view, signup_view, logout_view
from employee_data_service.api import upcoming_events_api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('upload/', upload_file, name='upload'),
    path('upcoming-events/<int:days>/', upcoming_events, name='upcoming_events'),    
    path('employee_data/', show_employee_data,name='employee_data'),
    path('api/upcoming-events/<int:days>/', upcoming_events_api, name='upcoming_events_api'),
    path('', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('logout/', logout_view, name='logout'),
]


