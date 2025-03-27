import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Posts from "./Posts";
import { Box, Grid } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function InvSearchBar() {
  const [searchBy, setSearchBy] = useState("");
  const [posts, setPosts] = useState([]);
  const [tempProfiles, setTempProfiles] = useState([]);

  // Base URL for the API. Falls back to localhost if environment variable is not set.
  const baseUrl = process.env.REACT_APP_BASEURL || "http://localhost:8080";
  const url = `${baseUrl}/investors/fetchAll`;

  // Fetch all investor data when the component loads, wrapped in useCallback for stability
  const fetchAllData = useCallback(async () => {
    try {
      const response = await axios.get(url);
      const allData = response.data.investor || [];
      setPosts(allData);
      setTempProfiles(allData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Optional: You can add user feedback here for failed API calls.
    }
  }, [url]);  // Adding `url` as a dependency because it's used inside the callback

  // UseEffect to call fetchAllData when the component mounts
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);  // Add fetchAllData as a dependency to avoid the ESLint warning

  // Filters the posts based on the search input (by name or field)
  const onSubmit = () => {
    const newPosts = posts.filter(
      (post) =>
        post.name.toLowerCase().includes(searchBy.toLowerCase()) ||
        post.field.toLowerCase().includes(searchBy.toLowerCase())
    );
    setTempProfiles(newPosts);
  };

  return (
    <Box sx={{ height: "100%", marginBottom: "10%", marginTop: "1%" }}>
      {/* Search Bar */}
      <Box sx={{ height: "10%", display: "flex", justifyContent: "center" }}>
        <Grid container spacing={1} sx={{ width: "20%", justifyContent: "center" }}>
          <Grid item md={9}>
            <TextField
              value={searchBy}
              name="searchBy"
              onChange={(e) => setSearchBy(e.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  onSubmit();
                }
              }}
              label="Search By Name/Field"
              fullWidth
            />
          </Grid>
          <Grid item md={3}>
            <Button variant="outlined" size="large" onClick={onSubmit}>
              Go
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Posts Section */}
      <Box sx={{ height: "90%" }}>
        {tempProfiles.length > 0 ? (
          <Posts posts={tempProfiles} />
        ) : (
          <Box sx={{ textAlign: "center", marginTop: "20px" }}>
            No profiles found.
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default InvSearchBar;
