import react from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useNavigate, Navigate } from "react-router-dom";

function Posts(props) {
  let navigate = useNavigate();
  return (
    <div className="posts">
      <Box sx={{ flexGrow: 1, margin: "2% 10% 10% 10%" }}>
        <Grid container spacing={4}>
          {props.posts.map((post, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card
                sx={{
                  maxWidth: "auto",
                  maxHeight: "auto",
                }}
              >
                {post.photo && post.photo.trim() ? (
                  <CardMedia
                    component="img"
                    height={"200"}
                    image={post.photo.startsWith('http') ? post.photo : `http://localhost:8080/${post.photo}`}
                    alt="Startup's Logo"
                    sx={{ border: 1, borderColor: "primary.main" }}
                    onClick={() => {
                      navigate("/startup", {
                        state: { id: post._id },
                      });
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 1,
                      borderColor: 'primary.main',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      navigate("/startup", {
                        state: { id: post._id },
                      });
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      {post.name.charAt(0).toUpperCase()}
                    </Typography>
                  </Box>
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <b>{post.name}</b>
                  </Typography>
                  <Typography variant="body2">
                    <i>{post.description}</i>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default Posts;
