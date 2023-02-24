## Instructions

### Backend

Create a virtual environment, activate it and install dependencies:

```python
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

Navigate to the backend directory, create a superuser and run syncdb. This command removes possible errors caused by the database being out of sync with the models:

```python
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py migrate --run-syncdb
```
Start the server

```python
python3 manage.py runserver
```

## Client

Navigate to the client directory, install dependencies and start the project.

```python
cd client
yarn install
npm start
```

# Features

- Use context-app . User loaded in app.js and persistent in RecipeCard component.
- Use context API. List of bookmarked at Favlist.js
- full backend in django. Frontend with react
- full auth system with refresh tokens
- containerized and deployed on Azure
- images hosted on CDN on Cloudinary
- search multiple keywords
- share recipe online

# Authentication Endpoints
The app includes the following endpoints for authenticating users:

## Request Token
To request a token, send a POST request to http://localhost:8000/api/token/ with the following JSON payload:

```bash
{
    "username": "xxx",
    "password": "xxx"
}

```
## Refresh Token

To refresh a token, send a POST request to http://localhost:8000/api/token/refresh/ with the following JSON payload:

```bash

{
    "refresh": "xxx"
}
```

# Endpoints

`create_recipe` - POST request to create a new recipe.
`get_recipe` - GET request to retrieve details of a recipe with the given primary key (pk).
`search_recipes` - POST request to search recipes based on ingredients.
`get_recipes` - GET request to retrieve details of all recipes.
`bookmark_recipe` - POST request to bookmark/unbookmark a recipe with the given primary key (pk).
`update_favorite` - PATCH request to update a favorite with the given primary key (pk).
`update_recipe_rating` - PATCH request to update the rating of a recipe with the given primary key (pk).
`get_bookmarked_recipes` - GET request to retrieve details of all bookmarked recipes.
`create_comment` - POST request to create a comment on a recipe with the given primary key (pk).
`recipe_comments` - GET request to retrieve all comments on a recipe with the given primary key (recipe_id).

# Models

`Recipe` - representing a recipe, with fields for image, author, date published, introduction, ingredients, instructions, bookmarked, rating, and tags.
`Tag` - representing a tag, with a name field.
`Comment` - representing a comment, with fields for text, recipe, and author.
`Favorite` - representing a favorite recipe, with fields for user, image, author, date published, introduction, ingredients, instructions, recipe, and scaling factor.

