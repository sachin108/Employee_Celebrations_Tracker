from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin

class Employee(models.Model):
    name = models.CharField(max_length=255)
    birthdate = models.DateField()
    hire_date = models.DateField()
    email = models.EmailField()


    def __str__(self):
        return self.name

