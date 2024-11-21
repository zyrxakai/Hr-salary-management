from django.db import models
from django.contrib.auth.models import AbstractUser

from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100, null=True, blank=True)

    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_groups',  # Unique related_name to avoid conflict
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',  # Unique related_name to avoid conflict
        blank=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        email_username = self.email.split("@")[0]
        if not self.full_name:
            self.full_name = email_username
        if not self.username:
            self.username = email_username
    
        super(User, self).save(*args, **kwargs)


class Employee(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    date_of_joining = models.DateField()
    phone_number = models.CharField(max_length=15)
    department = models.CharField(max_length=255)
    salary = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

    @classmethod
    def create_employee(cls, name, email, date_of_joining, phone_number, department, salary):
        """
        Class method to create a new employee.
        """
        # Ensure the email is unique
        if cls.objects.filter(email=email).exists():
            raise ValueError("An employee with this email already exists.")
        
        employee = cls(
            name=name,
            email=email,
            date_of_joining=date_of_joining,
            phone_number=phone_number,
            department=department,
            salary=salary
        )
        employee.save()
        return employee

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True)  # Allows NULL if user is missing
    phone_number = models.CharField(max_length=15)
    department = models.CharField(max_length=255)
    image = models.ImageField(upload_to='admin_images/', null=True, blank=True)

