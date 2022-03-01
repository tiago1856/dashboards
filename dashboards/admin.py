from django.contrib import admin
from .models import Query
from .models import Component
from .models import Dashboard
from .models import Layout
from .models import Config

admin.site.register(Query)
admin.site.register(Component)
admin.site.register(Dashboard)
admin.site.register(Layout)
admin.site.register(Config)

