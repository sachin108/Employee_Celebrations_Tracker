# Use a base image
FROM python:3.9

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Run the collectstatic command
RUN python manage.py collectstatic --noinput

# Run the migrations
RUN python manage.py makemigrations
RUN python manage.py migrate

# Make port 80 available to the world outside this container
EXPOSE 8000

# Define environment variable(s) if needed
ENV DJANGO_SETTINGS_MODULE=myapp.settings

# Define the command to run your application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
