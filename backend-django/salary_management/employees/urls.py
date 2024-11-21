from django.urls import path
from django.conf import settings
from .views import CustomTokenObtainPairView, EmployeeListCreateView, EmployeeDetailView, AdminProfileView, ExcelUploadView, RegisterView, CreateEmployeeView
from django.conf.urls.static import static

urlpatterns = [
    path('employees/', EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('register/', RegisterView.as_view(), name='register'),
     path('create_employee/', CreateEmployeeView.as_view(), name='create_employee'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('employees/<int:pk>/', EmployeeDetailView.as_view(), name='employee-details'),
    path('admin-profile/', AdminProfileView.as_view(), name='admin-profile'),
    path('upload-excel/', ExcelUploadView.as_view(), name='excel-upload'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
