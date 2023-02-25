from rest_framework import serializers
from .models import *
import cloudinary


class RecipeSerializer(serializers.ModelSerializer):
    cloudinary_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ('id', 'image', 'author', 'date_published', 'introduction', 'ingredients', 'instructions', 'bookmarked', 'rating', 'tags', 'cloudinary_image_url')

    def get_cloudinary_image_url(self, obj):
        return cloudinary.api.resource(obj.image.name)['url']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class RecipeSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Tag.objects.all()
    )

    class Meta:
        model = Recipe
        fields = '__all__'



class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'