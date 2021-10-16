from django.urls import path
from dashboards import views

app_name = "dashboards"
urlpatterns = [
    path('', views.dashboards, name='dashboards'),
]