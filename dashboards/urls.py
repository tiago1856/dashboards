from django.urls import path
from dashboards import views

app_name = "dashboards"
urlpatterns = [
    path('', views.dashboards, name='dashboards'),

    path('api/list_queries/', views.list_queries, name='list_queries'),
    path('api/exec_query/', views.exec_query, name='exec_query'),
]