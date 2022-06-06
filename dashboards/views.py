import re

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db import connection
from django.db import connections
from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from dashboards.serializers import QuerySerializer
from dashboards.serializers import ComponentSerializer, ComponentSerializer2
from dashboards.serializers import DashboardSerializer, DashboardSerializer2, DashboardSerializer3
from dashboards.serializers import LayoutSerializer
from dashboards.serializers import ConfigSerializer
from dashboards.serializers import SnapshotSerializer
from dashboards.models import Query, Component, Dashboard, Layout, Config, Snapshot

from django.conf import settings


DEFAULT_DATABASE = 'default'

# required for the raw queries
def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

# Create your views here.

def dashboards(request):
	databases = []
	for key in settings.DATABASES.keys():
		databases.append({'id': key, 'name': settings.DATABASES[key]['NAME']})

	return render(request,'dashboards/dashboards.html', {"databases":databases})

#########
# QUERY #
#########

#@login_required
@api_view(["GET"])
def list_queries(request):
   """Lists all queries."""
   if request.method == 'GET':
      try:
         queries = Query.objects.all()
         serializer = QuerySerializer(queries, many=True)         
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Query.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)       
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)



#@login_required
@api_view(["POST"])
def exec_query(request):
   """Executes a query."""
   if request.method == 'POST' or 'query' not in request.data:
         try:
            query = request.data.get('query')

            # TODO: $,# ARE TEMP - A SQL PARSER SHOULD BE USED
            # remove $ and # from conditions
            #conditions = re.findall(r"\$\w{0,100}?\$", query) 
            #for i in conditions:
            #   rep = i.replace('$','')               
            #   query = query.replace(i, rep)
            #values = re.findall(r"\#\w{0,100}?\#", query) 
            #for i in values:
            #   rep = i.replace('#','')               
            #   query = query.replace(i, rep)
            #with connection.cursor() as cursor:
            database = request.data.get('database')
            print(database, query)     
            if not database:
               database = DEFAULT_DATABASE            
            with connections[database].cursor() as cursor:
               if 'rows' in request.data:
                  # TODO: LIMIT ONLY APPLIES TO MYSQL, MARIASB, POSTGRESQL, MSSQL
                  cursor.execute(query + " limit " + str(request.data.get('rows')))
               else:
                  cursor.execute(query)
               results = dictfetchall(cursor)
               #print(results)
               return Response(data=results, status=status.HTTP_200_OK)
         except Exception as e:
            print (e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)



#@login_required
@api_view(["POST"])
def save_query(request):
   """Saves a Query."""
   if request.method == 'POST' or 'query_name' not in request.data:
      try:
         name = request.data.get('query_name')
         description = request.data.get('query_description')
         query = request.data.get('query')
         if request.user.is_authenticated:
            query = Query(name=name, author=request.user, description = description, query = query)
         else:
            query = Query(name=name, description = description, query = query)
         query.save()
         serializer = QuerySerializer(query)
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def update_query(request):
   """Updates a Query."""
   if request.method == 'POST' or 'query_name' not in request.data:
      try:
         query_id = request.data.get('query_id')
         #name = request.data.get('query_name')
         description = request.data.get('query_description')
         query = request.data.get('query')         

         if request.user.is_authenticated:
            new_data = {'author':request.user, 'description':description, 'query':query}
         else:
            new_data = {'description':description, 'query':query}

         Query.objects.filter(pk=query_id).update(**new_data)

         return Response({'message':'ok'}, status=status.HTTP_200_OK)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)




#@login_required
@api_view(["POST"])
def delete_query(request):
   """Deletes a query."""
   if request.method == 'POST' or 'query_id' not in request.data:
      try:
         Query.objects.filter(pk=request.data.get('query_id')).delete()
         # for now return nothing
         return Response(data={'message':'ok'}, status=status.HTTP_200_OK)
      except Query.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)


#############
# COMPONENT #
#############

#@login_required
@api_view(["POST"])
def check_name_component(request):
   """
      Checks if a component with a specific name already exists.
      If yes then returns a CONFLICT message else OK.

      Body params:
         id (number): Component ID
         name (string): Component name

      Returns:
         {'status': 666, 'result': 'CONFLICT'}

         {'status': 200, 'result': 'OK'}
   """
   if request.method == 'POST':
      try:
         #if (request.data.get('id')):
         #   components = Component.objects.filter(~Q(id=request.data.get('id')) & Q(name = request.data.get('name')))
         #else:
         components = Component.objects.filter(name = request.data.get('name'))
         if components.count() > 0:
            data = {'status': 666, 'result': 'CONFLICT'}
         else: 
            data = {'status': 200, 'result': 'OK'}
         return Response(data, status=status.HTTP_200_OK)
      except Component.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def save_component(request):
   """
      Saves a component 

      Body params:
         id (number): Component ID
         data (object): Component data
        
   """
   if request.method == 'POST':
      try:
         id = request.data.get('id')
         uuid = request.data.get('uuid')
         name = request.data.get('name')
         description = request.data.get('description')
         title = request.data.get('title')
         data = request.data.get('data')
         user = None
         if request.user.is_authenticated:
            user = request.user
         # exists => update
         if (id):
            component = Component.objects.get(pk=id)
            component.name = name
            component.description = description
            component.title = title
            component.data = data
            component.updated_by = user
         else:
            try:
               component = Component.objects.get(name=name)
               component.description = description
               component.title = title
               component.data = data
               component.updated_by = user
            except Component.DoesNotExist:   
               component = Component(
                  uuid = uuid,
                  name = name,
                  description = description,
                  title = title,
                  data = data,
                  author = user, 
                  updated_by = user
               )
         component.save()
         serializer = ComponentSerializer(component)
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Component.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)

#@login_required
@api_view(["GET"])
def list_components(request):
   """Lists all components."""
   if request.method == 'GET':
      try:
         queries = Component.objects.all()
         serializer = ComponentSerializer2(queries, many=True)         
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Component.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)       
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
def get_component(request, pk):
   """
      Gets a specific component.

      Params:
         pk (number): Component ID
   """
   if request.method == 'GET':
      try:
         component = Component.objects.get(id=pk)
         serializer = ComponentSerializer(component)
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Component.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)


#@login_required
@api_view(["POST"])
def delete_component(request):
   """Deletes a component."""
   if request.method == 'POST' or 'component_id' not in request.data:
      try:
         id = request.data.get('id')
         if id:
            Component.objects.filter(pk=id).delete()
         else:
            Response(data={'message':'No component deleted!'}, status=status.HTTP_304_NOT_MODIFIED)
         return Response(data={'message':'ok'}, status=status.HTTP_200_OK)
      except Component.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)



#############
# DASHBOARD #
#############

#@login_required
@api_view(["POST"])
def check_name_dashboard(request):
   """
      Checks if a dashboard with a specific name already exists.
      If yes then returns a CONFLICT message else OK.

      Body params:
         id (number): Component ID
         name (string): Component name

      Returns:
         {'status': 666, 'result': 'CONFLICT'}

         {'status': 200, 'result': 'OK'}
   """
   if request.method == 'POST':
      try:    
         if (request.data.get('id')):
            dashboards = Dashboard.objects.filter(~Q(id=request.data.get('id')) & Q(name = request.data.get('name')))
         else:
            dashboards = Dashboard.objects.filter(name = request.data.get('name'))
         if dashboards.count() > 0:
            data = {'status': 666, 'result': 'CONFLICT'}
         else: 
            data = {'status': 200, 'result': 'OK'}
         return Response(data, status=status.HTTP_200_OK)
      except Dashboard.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def save_dashboard(request):
   """
      Saves a dashboard 

      Body params:
         id (number): Dashboard ID
         data (object): Dashboard data
        
   """
   if request.method == 'POST':
      try:
         id = request.data.get('id')
         name = request.data.get('name')
         description = request.data.get('description')
         title = request.data.get('title')
         data = request.data.get('data')
         date_format = request.data.get('date_format')
         user = None
         layout = Layout.objects.get(pk = request.data.get('layout'))
         if request.user.is_authenticated:
            user = request.user
         # exists => update
         print("ID > ", id)
         if (id):
            dashboard = Dashboard.objects.get(pk=id)
            print("UPDATE")
            dashboard.name = name
            dashboard.description = description
            dashboard.title = title
            dashboard.data = data
            dashboard.updated_by = user
            dashboard.layout = layout
            dashboard.date_format = date_format
         else:
            print("NEW")
            dashboard = Dashboard(
               name = name,
               description = description,
               title = title,
               data = data,
               author = user, 
               updated_by = user,
               layout = layout,
               date_format = date_format
            )

         dashboard.save()

         serializer = DashboardSerializer(dashboard)
         return Response(serializer.data, status=status.HTTP_200_OK)
      except (Dashboard.DoesNotExist, Layout.DoesNotExist) as e:
         print(e)
         return Response(status=status.HTTP_404_NOT_FOUND)       
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)

#@login_required
@api_view(["GET"])
def list_dashboards(request):
   """Lists all dashboards."""
   if request.method == 'GET':
      try:
         dashboards = Dashboard.objects.all()
         serializer = DashboardSerializer2(dashboards, many=True)         
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Dashboard.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)       
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
def get_dashboard(request, pk):
   """
      Gets a specific dashboard.

      Params:
         pk (number): Dashboard ID
   """
   if request.method == 'GET':
      try:
         dashboard = Dashboard.objects.get(id=pk)
         serializer = DashboardSerializer3(dashboard)
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Dashboard.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)



#@login_required
@api_view(["POST"])
def delete_dashboard(request):
   """Deletes a dashboard."""
   if request.method == 'POST' or 'dashboard_id' not in request.data:
      try:
         Dashboard.objects.filter(pk=request.data.get('dashboard_id')).delete()
         return Response(data={'message':'ok'}, status=status.HTTP_200_OK)
      except Dashboard.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)



##########
# LAYOUT #
##########

@api_view(["GET"])
def get_layout(request, pk):
   """
      Gets a specific layout.
      If doesn't exists => fetch the first
      If last doesn't exists => error

      Params:
         pk (number): Layout id
   """
   if request.method == 'GET':
      try:
         try:
            layout = Layout.objects.get(id=pk)
            serializer = LayoutSerializer(layout)
         except Layout.DoesNotExist:
            # get first
            layout = Layout.objects.filter()[:1].get()
            serializer = LayoutSerializer(layout)
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Layout.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def list_layouts(request):
   """Lists all layouts."""
   if request.method == 'GET':
      try:
         dashboards = Layout.objects.all()
         serializer = LayoutSerializer(dashboards, many=True)         
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Layout.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)       
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def list_in_use_layouts(request):
   """Lists all layouts that are currently in use by any dashboard."""
   if request.method == 'GET':
      try:
         layouts = Dashboard.objects.order_by().values('layout').distinct().values_list('layout', flat=True)
         return Response(list(layouts), status=status.HTTP_200_OK)
      except Dashboard.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)       
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)


#@login_required
@api_view(["POST"])
def delete_layout(request):
   """Deletes a layout."""
   if request.method == 'POST' or 'layout_id' not in request.data:
      try:
         Layout.objects.filter(pk=request.data.get('layout_id')).delete()
         return Response(data={'message':'ok'}, status=status.HTTP_200_OK)
      except Layout.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)



#@login_required
@api_view(["POST"])
def save_layout(request):
   """Saves a Layout."""
   if request.method == 'POST':
      try:
         name = request.data.get('name')
         description = request.data.get('description')
         data = request.data.get('layout')
         if request.user.is_authenticated:
            layout = Layout(name=name, author=request.user, description = description, data = data)
         else:
            layout = Layout(name=name, description = description, data = data)
         layout.save()   
         return Response({'id': layout.id}, status=status.HTTP_200_OK)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)


##########
# CONFIG #
##########



#@login_required
@api_view(["POST"])
def save_config(request):
   """Saves a config."""
   if request.method == 'POST':
      try:
         name = request.data.get('name')
         dashboard = Dashboard.objects.get(pk = request.data.get('dashboard'))
         if request.user.is_authenticated:
            config = Config(name=name, author=request.user, dashboard = dashboard)
         else:
            config = Config(name=name, dashboard = dashboard)
         config.save()   
         return Response(data={'message':'ok'}, status=status.HTTP_200_OK)
      except Dashboard.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)         
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)


#@login_required
@api_view(["GET"])
def get_config(request):
   """
      Gets the last configuration.
      
      Returns the configuration or 'config': None if not config
      is defined.
   """
   if request.method == 'GET':
      try:
         #config = Config.objects.filter()[:1].get()#get(id=1)   # for now get the first, if any
         config = Config.objects.all().order_by('-id')
         serializer = ConfigSerializer(config[0])  # get last
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Config.DoesNotExist:
         return Response(data={'config': None}, status=status.HTTP_200_OK)
         #return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)





############
# SNAPSHOT #
############



@api_view(["POST"])
def save_snapshot(request):
   """
      Saves a snapshot of the a dashboard  

      Body params:
         dashboard_data (object): Dashboard data
        
   """
   if request.method == 'POST':
      try:
         name = request.data.get('name')
         description = request.data.get('description')
         components_content = request.data.get('components_content')
         data = request.data.get('data')
         date_format = request.data.get('date_format')
         user = None
         layout = Layout.objects.get(pk = request.data.get('layout'))
         global_date = request.data.get('global_date')

         if request.user.is_authenticated:
            user = request.user

         snapshot = Snapshot(
            name = name,
            description = description,
            components_content = components_content,
            data = data,
            author = user, 
            layout = layout,
            date_format = date_format,
            global_date = global_date
         )
         snapshot.save()

         serializer = SnapshotSerializer(snapshot)
         return Response(serializer.data, status=status.HTTP_200_OK)
      except (Snapshot.DoesNotExist, Layout.DoesNotExist) as e:
         print(e)
         return Response(status=status.HTTP_404_NOT_FOUND)       
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)



#@login_required
@api_view(["POST"])
def delete_snapshot(request):
   """Deletes a snapshot."""
   if request.method == 'POST' or 'snapshot_id' not in request.data:
      try:
         Snapshot.objects.filter(pk=request.data.get('snapshot_id')).delete()
         return Response(data={'message':'ok'}, status=status.HTTP_200_OK)
      except Snapshot.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)