from rest_framework import serializers
from dashboards.models import Query, Component, Layout

class QuerySerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username', read_only=True)
    class Meta:
        model = Query
        fields = ['id', 'name', 'description','date','author','author_name','query']


class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = '__all__'

class ComponentSerializer2(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = ['id', 'name', 'description','title']

class LayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Layout
        fields = '__all__'

class LayoutSerializer2(serializers.ModelSerializer):
    class Meta:
        model = Layout
        fields = ['id', 'name', 'description']
