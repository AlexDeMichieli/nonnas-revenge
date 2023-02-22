import React from "react";
import {Navigate } from "react-router-dom";
import RecipeForm from "../RecipeComponents/RecipeForm";

const PrivateRoute = ({children}) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated")
  if (!isAuthenticated) {
    return <Navigate to="/" />
  }
  else {
    return children
  }
}


export default PrivateRoute;