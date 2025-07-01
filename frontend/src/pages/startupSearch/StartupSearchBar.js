import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Posts from "./Posts";
import { Box, Grid } from "@mui/material";
import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

function StartupSearchBar() {
  const [searchBy, setSearchBy] = React.useState("");
  const [posts, setPosts] = React.useState([]);
  const [tempProfiles, setTempProfiles] = React.useState([]);

  const url = "http://localhost:8080/startups";

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    axios
      .get(`${url}`)
      .then((response) => {
        const allData = response.data.startups || []; // Fixed: use 'startups' and provide fallback
        console.log("Fetched startups:", allData);
        setPosts(allData);
        setTempProfiles(allData);
      })
      .catch((error) => {
        console.error(`Error fetching startups: ${error}`);
        setPosts([]);
        setTempProfiles([]);
      });
  };

  const onSumbit = () => {
    const newPosts = posts.filter(
      (post) =>
        post.name.toLowerCase().indexOf(searchBy.toLowerCase()) > -1 ||
        post.industries.toLowerCase().indexOf(searchBy.toLowerCase()) > -1 ||
        post.locations.toLowerCase().indexOf(searchBy.toLowerCase()) > -1
    );
    setTempProfiles(newPosts);
  };

  return (
    <Box sx={{ height: "100%", marginBottom: "10%", marginTop: "1%" }}>
      <Box sx={{ height: "10%", display: "flex", justifyContent: "center" }}>
        <Grid
          container
          spacing={1}
          sx={{ width: "20%", justifyContent: "center" }}
        >
          <Grid item md={9} sx={{ height: "10%", width: "90%" }}>
            {/* <div className="App"> */}
            <TextField
              value={searchBy}
              name="searchBy"
              id={searchBy}
              onChange={(e) => setSearchBy(e?.target?.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  onSumbit();
                }
              }}
              label="Search By Name/Location/Industry"
            />
          </Grid>
          <Grid item md={3} sx={{ marginTop: "2.5%", width: "10%" }}>
            <Button variant="outlined" size="large" onClick={onSumbit}>
              Go
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ height: "90%" }}>
        <Posts posts={tempProfiles} />        
      </Box>
    </Box>
  );
}

export default StartupSearchBar;
