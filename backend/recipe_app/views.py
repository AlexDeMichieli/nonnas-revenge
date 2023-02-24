from django.db.models import Q
from django.shortcuts import get_object_or_404


#--> Rest
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import serializers, status
from .serializers import *
from rest_framework.response import Response
#-->


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_recipe(request, format=None):
    data = request.data
    tags = data.pop('tags', []) 
    serializer = RecipeSerializer(data=data)

    if serializer.is_valid():
        recipe = serializer.save()
        for tag_name in tags:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            recipe.tags.add(tag)  
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recipe(request, pk, format=None):
    try:
        recipe = Recipe.objects.get(pk=pk)
    except Recipe.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = RecipeSerializer(recipe)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search_recipes(request, format=None):
    ingredients = request.data.get('ingredients', [])
    queries = [Q(ingredients__icontains=ingredient) for ingredient in ingredients]
    query = queries.pop()
    for item in queries:
        query |= item
    recipes = Recipe.objects.filter(query)
    serializer = RecipeSerializer(recipes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bookmark_recipe(request, pk, format=None):
    try:
        recipe = Recipe.objects.get(pk=pk)

    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    user = request.user
    existing_favorite = Favorite.objects.filter(user=user, recipe=recipe).first()
    if existing_favorite:
        # if favorite exists, delete it
        existing_favorite.delete()
        Recipe.objects.filter(pk=pk).update(bookmarked=False)
        return Response({'message': 'Favorite removed.'}, status=status.HTTP_200_OK)
    
    favorite_data = {
        'user': user.id,
        'image': recipe.image.url,
        'author': recipe.author,
        'date_published': recipe.date_published,
        'introduction': recipe.introduction,
        'ingredients': recipe.ingredients,
        'instructions': recipe.instructions,
        'scaling_factor': 1.0,
        'recipe': recipe.id 
    }
    
    serializer = FavoriteSerializer(data=favorite_data)
    if serializer.is_valid():
        serializer.save()
        Recipe.objects.filter(pk=pk).update(bookmarked=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_favorite(request, pk, format=None):
    try:
        favorite = Favorite.objects.get(pk=pk)
    except Favorite.DoesNotExist:
        return Response({'error': 'Favorite recipe not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = FavoriteSerializer(favorite, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_recipe_rating(request, pk, format=None):
    try:
        recipe = Recipe.objects.get(pk=pk)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    rating = request.data.get('rating', None)
    if rating is not None:
        recipe.rating = rating
    
    serializer = RecipeSerializer(recipe, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bookmarked_recipes(request, format=None):
    user = request.user
    favorites = Favorite.objects.filter(user=user)
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recipes(request, format=None):
    recipes = Recipe.objects.all()
    serializer = RecipeSerializer(recipes, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk)
    except Recipe.DoesNotExist:
        return Response(status=404)
    
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(recipe=recipe)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def recipe_comments(request, recipe_id):
    recipe = get_object_or_404(Recipe, pk=recipe_id)
    comments = recipe.comments.all()
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)
