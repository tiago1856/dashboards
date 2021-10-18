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


@login_required
@api_view(["GET"])
def list_queries(request):
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

@login_required
@api_view(["POST"])
def exec_query(request):
   if request.method == 'POST' or 'query' not in request.data:
         try:
            with connection.cursor() as cursor:
               cursor.execute(request.data.get('query'))
               results = dictfetchall(cursor)
               return Response(data=results, status=status.HTTP_200_OK)
         except Exception as e:
            print (e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)         
   else:
      return Response(status=status.HTTP_400_BAD_REQUEST)