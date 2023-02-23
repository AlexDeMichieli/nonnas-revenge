import React, { useContext, useState, useReducer } from "react";

import client from "../../utils/client"
import { UserContext } from "../../utils/setContext";

import { InputLabel, OutlinedInput, Button, Typography, Paper, Box, Grid, Stack, TextField, MenuItem, ListItemText, Select, FormControl, Checkbox } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageIcon from '@mui/icons-material/Image';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#4d243dff"
    },
    secondary: {
      main: "#d0a98fff"
    }
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const tagNames = [
  'breakfast',
  'lunch',
  'dinner',
  'spicy',
  'gluten-free',
  'vegetarian',
  'vegan',
  'paleo',
  'pescatarian',
  'low-carb'
];

const initialIngredientsState = [{ name: "", measurement: "", unit: "" }];

const ingredientsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_INGREDIENT":
      return [...state, { name: "", measurement: "", unit: "" }];
    case "REMOVE_INGREDIENT":
      const newState = [...state];
      newState.splice(action.payload, 1);
      return newState;
    case "UPDATE_INGREDIENT":
      const { index, name, value } = action.payload;
      const updatedState = [...state];
      updatedState[index][name] = value;
      return updatedState;
    default:
      return state;
  }
};

const RecipeForm = () => {
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [intro, setIntro] = useState("");
  const [ingredients, dispatchIngredients] = useReducer(
    ingredientsReducer,
    initialIngredientsState
  );
  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState([]);

  const username = useContext(UserContext)


  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddIngredient = () => {
    dispatchIngredients({ type: "ADD_INGREDIENT" });
  };

  const handleRemoveIngredient = (index) => {
    dispatchIngredients({ type: "REMOVE_INGREDIENT", payload: index });
  };

  const handleIngredientsChange = (index, event) => {
    const { name, value } = event.target;
    dispatchIngredients({
      type: "UPDATE_INGREDIENT",
      payload: { index, name, value },
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();
    const formData = new FormData();
    if(!image){
      alert('You forgot to add an image!')
      return
    }
    formData.append("image", image);
    formData.append("author", author);
    formData.append("date_published", datePublished);
    formData.append("introduction", intro);
    formData.append("instructions", instructions);
    formData.append("ingredients", ingredients.map(({ name, measurement, unit }) => `${name} ${measurement} ${unit}`).join('\n'));

    for (let key of tags) {
      formData.append('tags', key);
    }
    
    client.post("/api/create/", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTags(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ mb: 15 }} elevation={6}>
        <Box p={4}>
          <Typography variant="body2" align='center' color="textSecondary" component="p">Recipe magic for you, {username.user}!</Typography>
          <form onSubmit={handleSubmit}>
            <Grid sx={{ mt: 4, mb: 5 }} container justifyContent="space-around" alignItems="baseline" >
              
              <Button  startIcon={ !image ? <AddPhotoAlternateIcon/> : <ImageIcon/>}  variant="contained" component="label">
                Upload Image
                <input
                  hidden
                  accept="image/*"
                  multiple={false}
                  type="file"
                  onChange={handleImageChange}
                />
              </Button>

              <TextField
                label="Author"
                type="text"
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                variant="standard"
                margin="dense"
              />
              <TextField
                type="date"
                name="date_published"
                value={datePublished}
                onChange={(e) => setDatePublished(e.target.value)}
                variant="standard"
                margin="dense"
              />
            </Grid>
            <TextField
              label="Introduction"
              name="introduction"
              fullWidth
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              variant="outlined"
              margin="normal"
              multiline
              rows={2}
            />
            <div>Ingredients:</div>
            <Grid item xs={12}>
              {ingredients.map((ingredient, index) => (
                <Grid container spacing={1} key={index}>
                  <Grid item xs={2}>
                    <TextField
                      label="Name"
                      type="text"
                      name="name"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientsChange(index, e)}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      label="Measurement"
                      type="text"
                      name="measurement"
                      value={ingredient.measurement}
                      onChange={(e) => handleIngredientsChange(index, e)}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Unit"
                      type="text"
                      name="unit"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientsChange(index, e)}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid container justifyContent="center" alignItems="center" item xs={2}>
                    <IconButton
                      color="primary"
                      onClick={() => handleRemoveIngredient(index)}
                      disabled={ingredients.length === 1}
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                    <IconButton color="primary" onClick={handleAddIngredient}>
                      <AddCircleOutline />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <br />
            <Stack spacing={3}>
              <TextField
                label="Instructions"
                name="instructions"
                value={instructions}
                multiline
                rows={4}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </Stack>
            <br />
            <FormControl sx={{ mb: 3, width: 300 }}>
              <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={tags}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                MenuProps={MenuProps}
                renderValue={(selected) => selected.join(',')}
              >
                {tagNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={tags.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl >
            <br />
            <Button type='submit' sx={{ mb: 3, width: 300 }} color="secondary" variant="contained">Submit</Button>
          </form>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default RecipeForm;







