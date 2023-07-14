from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin

class Employee(models.Model):
    name = models.CharField(max_length=255)
    dob = models.DateTimeField(null=True)       
    doj = models.DateTimeField(null=True)       
    email = models.EmailField()
    eId=models.BigIntegerField(primary_key=True,null=False)
    fc=models.CharField(max_length=15)
    ff=models.CharField(max_length=50)
    dept=models.CharField(max_length=50, null=True)
    def __str__(self):
        return self.name
