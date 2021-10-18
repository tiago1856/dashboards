from rest_framework import serializers
from dashboards.models import Query

class QuerySerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username', read_only=True)
    class Meta:
        model = Query
        fields = ['id', 'name', 'description','date','author','author_name','query']

