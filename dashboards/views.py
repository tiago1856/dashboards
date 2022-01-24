from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db import connection
from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from dashboards.serializers import QuerySerializer
from dashboards.serializers import ComponentSerializer, ComponentSerializer2
from dashboards.serializers import LayoutSerializer, LayoutSerializer2
from dashboards.models import Query, Component, Layout


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
   return render(request,'dashboards/dashboards.html')

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
            #print(request.data.get('query'))
            with connection.cursor() as cursor:
               if 'rows' in request.data:                  
                  cursor.execute(request.data.get('query') + " limit " + str(request.data.get('rows')))
               else:
                  cursor.execute(request.data.get('query'))
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
         if (request.data.get('id')):
            components = Component.objects.filter(~Q(id=request.data.get('id')) & Q(name = request.data.get('name')))
         else:
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
         print("1111111111")
         id = request.data.get('id')
         name = request.data.get('name')
         description = request.data.get('description')
         title = request.data.get('title')
         data = request.data.get('data')
         user = None
         if request.user.is_authenticated:
            user = request.user
         # exists => update
         if (id):
            print("22222222222")
            component = Component.objects.get(pk=id)
            component.name = name
            component.description = description
            component.title = title
            component.data = data
            component.updated_by = user
         else:
            print("33333333333")
            component = Component(
               name = name,
               description = description,
               title = title,
               data = data,
               author = user, 
               updated_by = user
            )
         print("44444444444")
         component.save()
         print("5555555555")

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


##########
# LAYOUT #
##########

#@login_required
@api_view(["POST"])
def check_name_layout(request):
   """
      Checks if a layout with a specific name already exists.
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
            layouts = Layout.objects.filter(~Q(id=request.data.get('id')) & Q(name = request.data.get('name')))
         else:
            layouts = Layout.objects.filter(name = request.data.get('name'))
         if layouts.count() > 0:
            data = {'status': 666, 'result': 'CONFLICT'}
         else: 
            data = {'status': 200, 'result': 'OK'}
         return Response(data, status=status.HTTP_200_OK)
      except Layout.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def save_layout(request):
   """
      Saves a layout 

      Body params:
         id (number): Layout ID
         data (object): Layout data
        
   """
   if request.method == 'POST':
      try:
         id = request.data.get('id')
         name = request.data.get('name')
         description = request.data.get('description')
         title = request.data.get('title')
         data = request.data.get('data')
         user = None
         if request.user.is_authenticated:
            user = request.user
         # exists => update
         if (id):
            layout = Layout.objects.get(pk=id)
            layout.name = name
            layout.description = description
            layout.title = title
            layout.data = data
            layout.updated_by = user
         else:
            layout = Layout(
               name = name,
               description = description,
               title = title,
               data = data,
               author = user, 
               updated_by = user
            )

         layout.save()

         serializer = LayoutSerializer(layout)
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Layout.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)

#@login_required
@api_view(["GET"])
def list_layouts(request):
   """Lists all layouts."""
   if request.method == 'GET':
      try:
         layouts = Layout.objects.all()
         serializer = LayoutSerializer2(layouts, many=True)         
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Layout.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)       
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
def get_layout(request, pk):
   """
      Gets a specific layout.

      Params:
         pk (number): Layout ID
   """
   if request.method == 'GET':
      try:
         layout = Layout.objects.get(id=pk)
         serializer = LayoutSerializer(layout)
         return Response(serializer.data, status=status.HTTP_200_OK)
      except Layout.DoesNotExist:
         return Response(status=status.HTTP_404_NOT_FOUND)
      except Exception as e:
         print (e)
         return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)
