from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db import connection

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from dashboards.serializers import QuerySerializer
from dashboards.models import Query

# required for the raw queries
def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

# Create your views here.

def dashboards(request):
   return render(request,'dashboards/dashboards.html')


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

         #query_obj = Query.objects.get(pk=query_id)
         #serializer = QuerySerializer(query_obj)
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