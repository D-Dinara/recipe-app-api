# Generated by Django 3.2.25 on 2024-11-06 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_alter_recipe_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='image',
            field=models.CharField(default='https://picsum.photos/200', max_length=255),
        ),
    ]
