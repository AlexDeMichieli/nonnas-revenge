from django.contrib import admin
from .models import *

admin.site.register(Recipe)
admin.site.register(Tag)
admin.site.register(Favorite)
admin.site.register(Comment)

