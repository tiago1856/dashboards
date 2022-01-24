from rest_framework import serializers
from dashboards.models import Query, Component, Dashboard, Layout

class LayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Layout
        fields = '__all__'

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

class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = '__all__'

class DashboardSerializer2(serializers.ModelSerializer):
    layout_name = serializers.ReadOnlyField(source='layout.name', read_only=True)
    class Meta:
        model = Dashboard
        fields = ['id', 'name', 'description', 'layout', 'layout_name']

class DashboardSerializer3(serializers.ModelSerializer):
    layout_name = serializers.ReadOnlyField(source='layout.name', read_only=True)
    class Meta:
        model = Dashboard
        fields = ['id', 'name', 'description', 'layout', 'layout_name', 'title','data']
