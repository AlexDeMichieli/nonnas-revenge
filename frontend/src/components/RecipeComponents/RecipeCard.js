import React, { useState, useEffect, useContext, createRef } from 'react';
import client from '../../utils/client';
import { UserContext } from "../../utils/setContext";

import { Card, Button, Rating, Box, Modal, CardContent, TextField, Typography, Grid } from '@mui/material';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import FacebookIcon from '@mui/icons-material/Facebook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

const RecipeCard = ({ image, author, date_published, introduction, ingredients, instructions, bookmarked, rating, tags, id }) => {

  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [value, setValue] = useState(rating);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const ref = createRef();


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const username = useContext(UserContext)

  useEffect(() => {
    fetchRecipeComments();
  }, []);

  const fetchRecipeComments = async () => {
    try {
      const response = await client.get(`/api/recipes/${id}/comments/`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookmarkToggle = (e, id) => {

    const config = {
      method: 'post',
      url: `/api/bookmark-recipe/${id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    client(config)
      .then(response => {
        setIsBookmarked(!isBookmarked);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleRatingChange = (event, newValue) => {
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
      })
      .catch(error => {
        console.log(error);
      });
  }

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
      // pdf.output('dataurlnewwindow');
      pdf.save("download.pdf");
    });
  };

  return (

    <Grid key={id} item xs={12} sm={6} md={4} sx={{ p: 4 }}>
      <Card  id="divToPrint" ref={ref}>
        <img src={image} alt={introduction} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {introduction}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            By {author} on {date_published}
          </Typography>
          <Typography sx={{ mt: 3 }} variant="body2" color="textSecondary" component="div">
            Ingredients: {ingredients.split('\n').map((ingredient, index) => <div key={index}>{ingredient}</div>)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Instructions: {instructions}
          </Typography>
          {tags.map((tag, idx) => (
            <p key={idx}>{tag}</p>
          ))}
          <div>

          </div>
          <Grid sx={{ mt: 4, mb: 5 }} container justifyContent="space-around" alignItems="center" >
            {isBookmarked ? (
              <Button variant="contained" endIcon={<HeartBrokenIcon />} onClick={(e) => handleBookmarkToggle(e, id)}> Unmark </Button>
            ) : (
              <Button variant="contained" endIcon={<FavoriteIcon />} onClick={(e) => handleBookmarkToggle(e, id)}> Mark as Fav! </Button>
            )
            }
            <Button sx={{ width: 100 }} variant="contained" startIcon={<FacebookIcon />} onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent("https://www.google.com/"), 'popUpWindow', 'height=500,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes'
            )}>
              Share
            </Button>
              <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={printDocument}>Download</Button>
            <Rating
              name="simple-controlled"
              value={value}
              onChange={handleRatingChange}
              sx={{ mt: 3 }}
            />
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
      <Grid>
      </Grid>
    </Grid>
  );
};

export default RecipeCard;
