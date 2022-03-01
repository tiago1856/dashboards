from django.db import models

# Create your models here.

class Layout(models.Model):
    name = models.CharField(null=False, max_length = 80)
    description = models.CharField(blank=True, null=True, max_length = 128)
    date = models.DateTimeField(null=False, auto_now=True)
    author = models.ForeignKey('accounts.User', models.SET_NULL, db_column='author', blank=True, null=True, default=None, related_name="layout_author")
    data = models.JSONField(blank=True, null=True)
    
    class Meta:
        db_table = 'dash_layout'
        verbose_name_plural = "Layouts"
        constraints = [ models.UniqueConstraint(fields=['name'], name="layout_name") ]

    def __str__(self):
        return self.name



class Query(models.Model):
    name = models.CharField(null=False, max_length = 80)
    description = models.CharField(blank=True, null=True, max_length = 128)
    date = models.DateTimeField(null=False, auto_now=True)
    author = models.ForeignKey('accounts.User', models.SET_NULL, db_column='author', blank=True, null=True, default=None, related_name="form_author")
    query = models.CharField(null=False, max_length = 1024)


    class Meta:
        db_table = 'dash_query'
        verbose_name_plural = "Queries"
        constraints = [ models.UniqueConstraint(fields=['name'], name="query_name") ]

    def __str__(self):
        return self.name


class Component(models.Model):
    name = models.CharField(null=False, max_length = 80)
    description = models.CharField(blank=True, null=True, max_length = 128)
    title = models.CharField(blank=True, null=True, max_length = 128)
    date_created = models.DateTimeField(null=False, auto_now_add=True)
    date_updated = models.DateTimeField(null=False, auto_now=True)
    author = models.ForeignKey('accounts.User', models.SET_NULL, db_column='author', blank=True, null=True, default=None, related_name="component_author")
    updated_by = models.ForeignKey('accounts.User', models.SET_NULL, db_column='updated_by', blank=True, null=True, default=None, related_name="component_updated_by")
    data = models.JSONField(blank=True, null=True)

    class Meta:
        db_table = 'dash_component'
        verbose_name_plural = "Components"
        constraints = [ models.UniqueConstraint(fields=['name'], name="component_name") ]

    def __str__(self):
        return self.name


class Dashboard(models.Model):
    name = models.CharField(null=False, max_length = 80)
    description = models.CharField(blank=True, null=True, max_length = 128)
    title = models.CharField(blank=True, null=True, max_length = 128)
    date_created = models.DateTimeField(null=False, auto_now_add=True)
    date_updated = models.DateTimeField(null=False, auto_now=True)
    author = models.ForeignKey('accounts.User', models.SET_NULL, db_column='author', blank=True, null=True, default=None, related_name="dashboard_author")
    updated_by = models.ForeignKey('accounts.User', models.SET_NULL, db_column='updated_by', blank=True, null=True, default=None, related_name="dashboard_updated_by")
    layout = models.ForeignKey(Layout, models.SET_NULL, db_column='layout', blank=True, null=True, default=None, related_name="dashboard_layout")
    data = models.JSONField(blank=True, null=True)

    class Meta:
        db_table = 'dash_dashboard'
        verbose_name_plural = "Dashboards"
        constraints = [ models.UniqueConstraint(fields=['name'], name="dashboard_name") ]

    def __str__(self):
        return self.name


class Config(models.Model):
    name = models.CharField(null=False, max_length = 80)
    dashboard = models.ForeignKey(Dashboard, models.SET_NULL, db_column='dashboard', blank=True, null=True, default=None, related_name="config_dashboard")
    date = models.DateTimeField(null=False, auto_now=True)
    author = models.ForeignKey('accounts.User', models.SET_NULL, db_column='author', blank=True, null=True, default=None, related_name="config_author")
    
    class Meta:
        db_table = 'dash_config'
        verbose_name_plural = "Config"

    def __str__(self):
        return self.name

