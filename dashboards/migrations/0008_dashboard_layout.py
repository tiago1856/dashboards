# Generated by Django 3.1.7 on 2022-01-24 13:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboards', '0007_auto_20220124_1339'),
    ]

    operations = [
        migrations.AddField(
            model_name='dashboard',
            name='layout',
            field=models.ForeignKey(blank=True, db_column='layout', default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='dashboard_layout', to='dashboards.layout'),
        ),
    ]
