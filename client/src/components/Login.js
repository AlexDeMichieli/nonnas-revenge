import { useContext, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../utils/setContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4d243dff'
    },
    secondary: {
      main: '#d0a98fff'
    }
  }
});

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  let navigate = useNavigate();
  const { user, setUser}  = useContext(UserContext)

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      "username": username,
      "password": password
    };
    const headerConfig = { headers: { "Content-Type": "application/json" } };
    try {
      await axios.post(`http://localhost:8000/api/token/`, data, headerConfig).then((res) => {
        const token = {
          access_token: res.data.access,
          refresh_token: res.data.refresh
        }
        localStorage.setItem("token", JSON.stringify(token.access_token));
        localStorage.setItem("refreshToken", JSON.stringify(token.refresh_token));
        localStorage.setItem("isAuthenticated", true);
        setUser(username)
        navigate("/recipeform");
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={handleUsernameChange}
          sx={{ mb: 2 }}
        />
        <TextField
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="secondary" fullWidth>
          Sign In
        </Button>
      </form>
    </ThemeProvider>
  );
}
