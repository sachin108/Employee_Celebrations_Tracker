# Generated by Django 4.2.3 on 2023-07-11 18:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee_data_service', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employee',
            name='ff',
        ),
        migrations.AlterField(
            model_name='employee',
            name='dob',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='employee',
            name='doj',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
