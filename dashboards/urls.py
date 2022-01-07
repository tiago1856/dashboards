from django.urls import path
from dashboards import views

app_name = "dashboards"
urlpatterns = [
    path('', views.dashboards, name='dashboards'),

    # query
    path('api/list_queries/', views.list_queries, name='list_queries'),
    path('api/exec_query/', views.exec_query, name='exec_query'),
    path('api/save_query/', views.save_query, name='save_query'),
    path('api/update_query/', views.update_query, name='update_query'),
    path('api/delete_query/', views.delete_query, name='delete_query'),

    # component
    path('api/check_name_component/', views.check_name_component, name="check_name_component"),
    path('api/save_component/', views.save_component, name="save_component"),
    path('api/list_components/', views.list_components, name="list_components"),
    path('api/get_component/<int:pk>/', views.get_component, name="get_component"),

    # layout
    path('api/check_name_layout/', views.check_name_layout, name="check_name_layout"),
    path('api/save_layout/', views.save_layout, name="save_layout"),
    path('api/list_layouts/', views.list_layouts, name="list_layouts"),
    path('api/get_layout/<int:pk>/', views.get_layout, name="get_layout"),


]