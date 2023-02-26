import { useEffect, useState } from "react";

import client from "../../utils/client";
import Search from "./Search";


import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, Button, Rating, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import FavoriteIcon from '@mui/icons-material/Favorite';
import "../../index.css"

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
    const [value, setValue] = useState();

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await client.get("/api/get_recipes");
            setRecipes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBookmarkToggle = (e, id) => {
        const index = recipes.findIndex(recipe => recipe.id === id);
        const updatedRecipes = [...recipes];
        const isBookmarked = updatedRecipes[index].bookmarked;

        const config = {
            method: 'post',
            url: `/api/bookmark-recipe/${id}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        client(config)
            .then(response => {
                updatedRecipes[index].bookmarked = !isBookmarked;
                setRecipes(updatedRecipes);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleRatingChange = (event, newValue, id) => {
        console.log(newValue)
        const config = {
            method: 'patch',
            url: `/api/update_rating/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                rating: newValue
            }
        };

        client(config)
            .then(response => {
                setValue(newValue);
                fetchRecipes()
                console.log('request made')
            })
            .catch(error => {
                console.log(error);
            });
    }


    return (
        <ThemeProvider theme={theme}>
            <Grid container justifyContent="center" alignItems="center" sx={{ mb: 5 }}>
                <Search setRecipes={setRecipes} />
            </Grid>
            {recipes.map((recipe) => (
                <Grid key={recipe.id} item xs={12} sm={6} md={4} sx={{ p: 4 }}>
                    <Card id="divToPrint" className='recipe-card'>
                        <CardMedia style={{ height: 0, paddingTop: '56.25%' }}
                            image={recipe.image} alt={recipe.introduction} />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {recipe.introduction}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                By {recipe.author} on {recipe.date_published}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                                <b>tags</b>
                            </Typography>
                            {recipe.tags.map((tag, idx) => (
                                <span key={idx}>{tag}{" "}</span>
                            ))}
                            <Grid sx={{ mt: 4, mb: 5 }} container justifyContent="space-around" alignItems="center" >
                                {recipe.bookmarked ? (
                                    <Button variant="contained" endIcon={<HeartBrokenIcon />} onClick={(e) => handleBookmarkToggle(e, recipe.id)}> Unmark </Button>
                                ) : (
                                    <Button variant="contained" endIcon={<FavoriteIcon />} onClick={(e) => handleBookmarkToggle(e, recipe.id)}> Bookmark </Button>
                                )
                                }
                                <Rating
                                    name="simple-controlled"
                                    className="recipe-rating"
                                    value={recipe.rating}
                                    onChange={(e, newValue) => handleRatingChange(e, newValue, recipe.id)}
                                    sx={{ mt: 3 }}
                                />
                            </Grid>
                        </CardContent>
                        <Button href={`/recipe/${recipe.id}`} fullWidth color='info' variant="contained"> Check me out! </Button>
                    </Card>

                </Grid>
            ))}
        </ThemeProvider>
    );
};

export default RecipeList;
