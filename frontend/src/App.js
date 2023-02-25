import React, {useState } from "react";

import Login from "./components/Login";
import Navigation from "./components/Navigation";
import PrivateRoute from "./components/routing/PrivateRoute";
import RecipeForm from './components/RecipeComponents/RecipeForm';
import RecipeList from "./components/RecipeComponents/RecipeList";
import FavsList from "./components/FavoritesComponents/FavsList";

import { Grid } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import { UserContext } from "./utils/setContext";

const App = () => {
  const [user, setUser] = useState()
  const [recipeList, setRecipeList] = useState()
  const [fav, setFav] = useState()

  
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return (

    <UserContext.Provider value={{ user, setUser, recipeList, setRecipeList, fav, setFav }}>
      <Navigation isAuthenticated={isAuthenticated} />
      <Grid container justifyContent="center" alignItems="center" style={{ marginTop: "64px" }}>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route
            path="/recipeform"
            element={
              <PrivateRoute>
                <RecipeForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/list"
            element={
              <PrivateRoute>
                <RecipeList />
              </PrivateRoute>
            }
          />
          <Route
            path="/favs"
            element={
              <PrivateRoute>
                <FavsList />
              </PrivateRoute>
            }
          />
        </Routes>
      </Grid>
    </UserContext.Provider>


  );
}

export default App;
