from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . models import Employee, AdminProfile
from . serializers import EmployeeSerializer, AdminProfileSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import AllowAny,IsAuthenticated
import pandas as pd
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({'user': EmployeeSerializer(self.user).data})
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class EmployeeListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class EmployeeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            employee = Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    
    def put(self, request, pk):
        try:
            employee = Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            employee = Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CreateEmployeeView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        # Initialize the serializer with the request data
        serializer = EmployeeSerializer(data=request.data)
        
        if serializer.is_valid():
            # Create the employee and return a success response
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # If the data is invalid, return a bad request response
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            admin_profile = AdminProfile.objects.get(user=request.user)
        except AdminProfile.DoesNotExist:
            return Response({"error": "Admin profile not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = AdminProfileSerializer(admin_profile)
        return Response(serializer.data)

    def put(self, request):
        try:
            admin_profile = AdminProfile.objects.get(user=request.user)
        except AdminProfile.DoesNotExist:
            return Response({"error": "Admin profile not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = AdminProfileSerializer(admin_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

   
class ExcelUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES['file']
        df = pd.read_excel(file)

        # Validate required columns
        required_columns = ['id', 'name', 'department', 'email', 'hours_worked', 'hourly_rate']
        missing_columns = [col for col in required_columns if col not in df.columns]

        if missing_columns:
            return Response(
                {"error": f"Missing columns: {', '.join(missing_columns)}"},
                status=400
            )

        # Calculate salary
        df['salary'] = df['hours_worked'] * df['hourly_rate']

        # Save or update employees in the database
        # Example: iterate over DataFrame rows and update records
        # for index, row in df.iterrows():
        #     Employee.objects.update_or_create(
        #         id=row['id'],
        #         defaults={
        #             "name": row['name'],
        #             "department": row['department'],
        #             "email": row['email'],
        #             "hours_worked": row['hours_worked'],
        #             "hourly_rate": row['hourly_rate'],
        #             "salary": row['salary'],
        #         }
        #     )

        # Return the updated data
        return Response(df.to_dict(orient='records'))