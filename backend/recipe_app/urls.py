from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_recipe),
    path('get_recipe/<int:pk>', views.get_recipe, name='get_recipe'),
    path('search_recipes/', views.search_recipes, name='search_recipes'),
    path('get_recipes/', views.get_recipes, name='get_recipes'),
    path('bookmark-recipe/<int:pk>', views.bookmark_recipe, name='bookmark_recipe'),
    path('update_favorite/<int:pk>', views.update_favorite, name='update_favorite'),
    path('update_rating/<int:pk>', views.update_recipe_rating, name='update_rating'),
    path('get_bookmarked_recipes/', views.get_bookmarked_recipes, name='get_bookmarked_recipes'),
    path('create_comment/<int:pk>', views.create_comment, name='create_comment'),
    path('recipes/<int:recipe_id>/comments/', views.recipe_comments, name='recipe_comments'),

]