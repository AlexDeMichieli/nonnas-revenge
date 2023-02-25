import {useEffect, useState } from "react";

import client from "../../utils/client";
import RecipeCard from "./RecipeCard";
import Search from "./Search";


import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

const theme = createTheme({
    palette: {
        primary: {
            main: '#edd4b2ff'
        },
        secondary: {
            main: '#d0a98fff'
        },
        info: {
            main: '#4d243dff'
          },
        spacing: 4,
    }
});

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await client.get("/api/get_recipes");
                setRecipes(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRecipes();
    }, []);


    return (
        <ThemeProvider theme={theme}>
            <Grid container justifyContent="center" alignItems="center" sx={{ mb: 5}}>
            <Search setRecipes={setRecipes} />
            </Grid>
            {recipes.map((recipe) => (
                <RecipeCard
                    key={recipe.id}
                    image={recipe.image}
                    author={recipe.author}
                    date_published={recipe.date_published}
                    introduction={recipe.introduction}
                    ingredients={recipe.ingredients}
                    instructions={recipe.instructions}
                    bookmarked = {recipe.bookmarked}
                    rating={recipe.rating}
                    tags={recipe.tags}
                    id={recipe.id}
                />
            ))}
        </ThemeProvider>
    );
};

export default RecipeList;
