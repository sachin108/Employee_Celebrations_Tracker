from django.contrib.auth.models import User
username = "admin"
email = "admin@example.com"
password = "hello"

try:
    user = User.objects.create_superuser(username, email, password)
    print("Superuser created successfully.")
except Exception as e:
    print("Error creating superuser:", str(e))
