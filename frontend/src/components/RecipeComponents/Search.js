import { useState } from "react";
import client from "../../utils/client";
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const Search = ({ setRecipes }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSubmit = () => {
        const ingredients = searchQuery.split(" ").map((word) => word.trim());
        const data = JSON.stringify({
          "ingredients": ingredients
        });
        const config = {
          method: 'post',
          url: '/api/search_recipes/',
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };
        
        client(config)
        .then((response) =>{ 
            setRecipes(response.data)
        })
        .catch((error) => {console.log(error)});
    }

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ mb: 5 }}>
            <TextField
                label="Search recipes"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ mr: 5 }}
            />
            <Button onClick={handleSubmit} variant="contained" color="secondary">
                Search
            </Button>
        </Grid>
    );
};

export default Search;
