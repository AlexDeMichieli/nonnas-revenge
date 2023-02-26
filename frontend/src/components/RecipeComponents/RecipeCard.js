import React, { useState, useEffect, useContext } from 'react';
import client from '../../utils/client';
import { UserContext } from "../../utils/setContext";
import { useParams } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, Button, Box, Modal, CardContent, CardMedia, TextField, Typography, Grid } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import CircularProgress from '@mui/material/CircularProgress';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../../index.css"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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

const RecipeCard = () => {
  const [card, setCard] = useState()
  const [loading, setIsLoading] = useState()
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const username = useContext(UserContext)

  useEffect(() => {
    fetchCard()
    fetchRecipeComments()
  }, []);

  const fetchCard = async () => {
    setIsLoading(true);
    try {
      const response = await client.get(`/api/get_recipe/${id}`);
      setCard(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecipeComments = async () => {
    try {
      const response = await client.get(`/api/recipes/${id}/comments/`);
      setComments(response.data);
      console.log(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = JSON.stringify({
      "text": content,
      "author": username.user,
      "recipe": id
    });

    const config = {
      method: 'POST',
      url: `/api/create_comment/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    client(config)
      .then((response) => {
        fetchRecipeComments()
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const printDocument = () => {
    const input = document.getElementById("divToPrint");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save("download.pdf");
    });
  };


  return (
    <ThemeProvider theme={theme}>

      <Grid key={id} item xs={12} sm={6} md={4} sx={{ p: 4 }}>
        {!loading && card && comments ?
          <Card id="divToPrint" className='recipe-card'>
            <CardMedia style={{ height: 0, paddingTop: '56.25%' }}
              image={card.image} alt={card.introduction} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {card.introduction}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                By {card.author} on {card.date_published}
              </Typography>
              <Typography sx={{ mt: 3 }} variant="body2" color="textSecondary" component="div">
                <b>Ingredients</b>: {card.ingredients.split('\n').map((ingredient, index) => <div key={index}>{ingredient}</div>)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Instructions: {card.instructions}
              </Typography>
              {card.tags.map((tag, idx) => (
                <p key={idx}>{tag}</p>
              ))}
              <Grid sx={{ mt: 4, mb: 5 }} container justifyContent="space-around" alignItems="center" >
                <Button sx={{ width: 100 }} variant="contained" startIcon={<FacebookIcon />} onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(`${window.location.href}`), 'popUpWindow', 'height=500,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes'
                )}>
                  Share
                </Button>
                <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={printDocument}>Download</Button>
              </Grid>
            </CardContent>
            <div>
              <Button fullWidth color='info' variant='contained' onClick={handleOpen}>Add and check comments!</Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography sx={{ mt: 4 }} variant="h6" component="h3">
                    Comments
                  </Typography>
                  {comments.map((comment, idx) => (
                    <div key={idx}>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Author: {comment.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        {comment.text}
                      </Typography>
                    </div>
                  ))}
                  <Typography sx={{ mt: 4 }} variant="h6" component="h3">
                    Add Comment
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <TextField
                          required
                          fullWidth
                          label="Comment"
                          variant="outlined"
                          multiline
                          rows={4}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                      </Grid>
                      <Grid item>
                        <Button type="submit" variant="contained" color="primary">
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              </Modal>
            </div>
          </Card>
          : <CircularProgress className='spinner' />
        }
        <Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default RecipeCard;
