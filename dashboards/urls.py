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

    # dashboard
    path('api/check_name_dashboard/', views.check_name_dashboard, name="check_name_dashboard"),
    path('api/save_dashboard/', views.save_dashboard, name="save_dashboard"),
    path('api/list_dashboards/', views.list_dashboards, name="list_dashboards"),
    path('api/get_dashboard/<int:pk>/', views.get_dashboard, name="get_dashboard"),
    path('api/delete_dashboard/', views.delete_dashboard, name="delete_dashboard"),

    # layout
    path('api/get_layout/<int:pk>/', views.get_layout, name="get_layout"),
    path('api/list_layouts/', views.list_layouts, name="list_layouts"),
    path('api/list_in_use_layouts/', views.list_in_use_layouts, name="list_in_use_layouts"),
    path('api/delete_layout/', views.delete_layout, name="delete_layout"),
    path('api/save_layout/', views.save_layout, name="save_layout"),

]