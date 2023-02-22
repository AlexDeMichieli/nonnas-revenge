import React, { useState, useEffect } from 'react'

import client from '../../utils/client';
import { Select, MenuItem, Grid, Card, InputLabel, CardHeader, CardMedia, CardContent, Typography, FormControl, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#4d243dff"
    },
    secondary: {
      main: "#ecdcc9ff"
    }
  }
});


const FavsCard = ({ author, datePublished, image, ingredients, instructions, introduction, id, onUpdateRecipe }) => {

  const [multiplier, setMultiplier] = useState(1);
  const baseUrl = "http://localhost:8000";
  const imageUrl = `${baseUrl}${image}`;

  const handleScalingFactorChange = (event) => {
    setMultiplier(event.target.value);
  };

  const handleUpdateFavorite = async (id, ingredients) => {

    const updatedFavorite = {
      id: id,
      ingredients: ingredients.replace(/\d+(\.\d+)?/g, (match) =>
        (parseFloat(match) * multiplier)
      ),
      scaling_factor: multiplier,
    };

    const config = {
      method: 'PATCH',
      url: `/api/update_favorite/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: updatedFavorite
    };

    client(config)
      .then(response => {
        onUpdateRecipe(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <ThemeProvider theme={theme}>

      <Card key={id} style={{ marginBottom: 16 }}>
        <CardHeader
          subheader={datePublished}
        />
        <CardMedia
          style={{ height: 0, paddingTop: '56.25%' }}
          image={imageUrl}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {author}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            {introduction}
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="body2" color="textSecondary" component="div">
            Ingredients: {ingredients.split('\n').map((ingredient, index) => <div key={index}>{ingredient}</div>)}
          </Typography>
          <Typography variant="body1" color="textPrimary" component="p">
            Instructions:
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {instructions}
          </Typography>
          <Grid sx={{ mt: 4, mb: 5 }} container justifyContent="space-around" alignItems="center" >

            <FormControl fullWidth style={{ marginTop: 16 }}>
              <InputLabel id="scale-recipe">Scale your Recipe</InputLabel>

              <Select
                value={multiplier}
                onChange={handleScalingFactorChange}
                label="Scale your Recipe"
                labelId="scale-recipe"
                id="scale-recipe"
              >
                <MenuItem value={0.5}>1/2x</MenuItem>
                <MenuItem value={2}>2x</MenuItem>
                <MenuItem value={3}>3x</MenuItem>
              </Select>
            </FormControl>
            <Button
              style={{ marginTop: 16 }}
              variant="contained"
              color="secondary"
              onClick={() => handleUpdateFavorite(id, ingredients)}
            >
              Update Favorite
            </Button>
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default FavsCard;
