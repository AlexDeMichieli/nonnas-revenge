from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    image =  models.ImageField(upload_to ='images/')
    author = models.CharField(max_length=100)
    date_published = models.DateField()
    introduction = models.TextField()
    ingredients = models.TextField(max_length=1000)
    instructions = models.TextField()
    bookmarked = models.BooleanField(default=False)
    rating = models.IntegerField(default=1)
    tags = models.ManyToManyField('Tag', null=True, blank=True)

    def __str__(self):
        return f"{self.introduction} - {self.date_published} - {self.id}"


class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} - {self.id}"


class Comment(models.Model):
    text = models.TextField()
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='comments')
    author = models.TextField(blank=True, null=True )

    def __str__(self):
        return f"{self.text[:50]}"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image =  models.CharField(max_length=400)
    author = models.CharField(max_length=100)
    date_published = models.DateField()
    introduction = models.TextField()
    ingredients = models.TextField(max_length=1000)
    instructions = models.TextField()
    recipe = models.OneToOneField(
        Recipe,
        on_delete=models.CASCADE,
        primary_key=True,
    )

    def __str__(self):
        return f"{self.user.username} - {self.introduction}"
