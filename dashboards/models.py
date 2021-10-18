from django.db import models

# Create your models here.

class Query(models.Model):
    name = models.CharField(null=False, max_length = 80)
    description = models.CharField(blank=True, null=True, max_length = 128)
    date = models.DateTimeField(null=False, auto_now=True)
    author = models.ForeignKey('accounts.User', models.SET_NULL, db_column='author', blank=True, null=True, related_name="form_author")
    query = models.CharField(null=False, max_length = 1024)


    class Meta:
        db_table = 'query'
        verbose_name_plural = "Queries"
        constraints = [ models.UniqueConstraint(fields=['name'], name="query_name") ]

    def __str__(self):
        return self.name
