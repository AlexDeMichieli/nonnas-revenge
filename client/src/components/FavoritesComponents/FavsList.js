import { React, useEffect, useState, useContext } from 'react'
import { UserContext } from '../../utils/setContext';
import FavsCard from "./FavsCard"
import client from '../../utils/client';
import Grid from '@mui/material/Grid';


const FavsList = () => {
  const [recipes, setRecipes] = useState([]);
  const { fav, setFav } = useContext(UserContext)

  console.log(fav)

  useEffect(() => {
    const getBookmarkedRecipes = async () => {
      const response = await client.get('api/get_bookmarked_recipes/');
      setRecipes(response.data);
      setFav(response.data)
    };
    getBookmarkedRecipes();
  }, []);

  const handleUpdateRecipe = (updatedRecipe) => {
    console.log(updatedRecipe)
    const updatedRecipes = recipes.map((recipe) =>
      recipe.recipe === updatedRecipe.recipe ? updatedRecipe : recipe
    );
    setRecipes(updatedRecipes);
    setFav(updatedRecipes)
  };


  return (
    <Grid container justifyContent="space-around" alignItems="center" sx={{ m: 5 }}>
      {recipes.map((recipe) => (
        <Grid item key={recipe.recipe} xs={12} md={4}>
          <FavsCard
            author={recipe.author}
            datePublished={recipe.date_published}
            image={recipe.image}
            ingredients={recipe.ingredients}
            instructions={recipe.instructions}
            introduction={recipe.introduction}
            id={recipe.recipe}
            onUpdateRecipe={handleUpdateRecipe}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default FavsList

