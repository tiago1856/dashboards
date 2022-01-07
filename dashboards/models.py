from django.db import models

# Create your models here.

class Query(models.Model):
    name = models.CharField(null=False, max_length = 80)
    description = models.CharField(blank=True, null=True, max_length = 128)
    date = models.DateTimeField(null=False, auto_now=True)
    author = models.ForeignKey('accounts.User', models.SET_NULL, db_column='author', blank=True, null=True, default=None, related_name="form_author")
    query = models.CharField(null=False, max_length = 1024)


    class Meta:
        db_table = 'query'
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
        db_table = 'component'
        verbose_name_plural = "Components"
        constraints = [ models.UniqueConstraint(fields=['name'], name="component_name") ]

    def __str__(self):
        return self.name


class Layout(models.Model):
    name = models.CharField(null=False, max_length = 80)
    description = models.CharField(blank=True, null=True, max_length = 128)
    title = models.CharField(blank=True, null=True, max_length = 128)
    date_created = models.DateTimeField(null=False, auto_now_add=True)
    date_updated = models.DateTimeField(null=False, auto_now=True)
    author = models.ForeignKey('accounts.User', models.SET_NULL, db_column='author', blank=True, null=True, default=None, related_name="layout_author")
    updated_by = models.ForeignKey('accounts.User', models.SET_NULL, db_column='updated_by', blank=True, null=True, default=None, related_name="layout_updated_by")
    data = models.JSONField(blank=True, null=True)

    class Meta:
        db_table = 'layout'
        verbose_name_plural = "Layouts"
        constraints = [ models.UniqueConstraint(fields=['name'], name="layout_name") ]

    def __str__(self):
        return self.name
