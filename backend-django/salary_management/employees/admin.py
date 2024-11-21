from django.contrib import admin
from .models import Employee, AdminProfile

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'department', 'salary', 'date_of_joining')
    search_fields = ('name', 'email')
    list_filter = ('department',)
    ordering = ('name',)
    actions = ['delete_selected']

@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'department')
    search_fields = ('user__email', 'user__full_name')


