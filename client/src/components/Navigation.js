import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4d243dff'
    },
    secondary: {
      main: '#d0a98fff'
    },
    info: {
      main: '#4d243dff'
    },
    success: {
      main: '#cac2b5ff'
    },
    warning: {
      main: '#ecdcc9ff'
    },
  },
});

const authLinks = (
  <div>
    <Button component={Link} to="/recipeform" color="inherit">
      Create
    </Button>
    <Button component={Link} to="/list" color="inherit">
      Recipes
    </Button>
    <Button component={Link} to="/favs" color="inherit">
      Favs
    </Button>
  </div>
)
const Navigation = ({ isAuthenticated }) => {
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setAuthStatus(true);
    } else {
      setAuthStatus(false);
    }
  }, [isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography className="strong-hover-shake" variant="h6" style={{ flexGrow: 1 }}>
            Nonna's Revenge
          </Typography>
          <Button component={Link} to="/" color="inherit">
            Login
          </Button>
          {authStatus && authLinks}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navigation;