import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

function InvestorStartups() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investorData, setInvestorData] = useState({
    name: "",
    email: "",
    contactNo: "",
    field: "",
    totalInvestment: "",
  });
  const [error, setError] = useState(null);

  // Fetching investors data from backend API
  const fetchInvestors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/investors");
      setInvestors(response.data.investors);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching investors:", error);
      setError("Error fetching investors.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvestorData({ ...investorData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (
      !investorData.name ||
      !investorData.email ||
      !investorData.contactNo ||
      !investorData.field ||
      !investorData.totalInvestment
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/investors", investorData);
      alert(response.data.message);
      setInvestorData({
        name: "",
        email: "",
        contactNo: "",
        field: "",
        totalInvestment: "",
      });
      setError(null); // Clear error if submission is successful
      fetchInvestors(); // Refetch investors data after adding a new investor
    } catch (error) {
      console.error("Error adding investor:", error);
      setError("Error adding investor.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (investors.length === 0) {
    return <div>No investors available</div>;
  }

  return (
    <Grid container spacing={3} sx={{ padding: "20px" }}>
      {/* Investor Form on the Left */}
      <Grid item xs={12} sm={6}>
        <Box sx={{ padding: "20px", boxShadow: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Add an Investor
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              label="Investor Name"
              name="name"
              value={investorData.name}
              onChange={handleInputChange}
              sx={{ marginBottom: "15px" }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={investorData.email}
              onChange={handleInputChange}
              sx={{ marginBottom: "15px" }}
            />
            <TextField
              fullWidth
              label="Contact No"
              name="contactNo"
              value={investorData.contactNo}
              onChange={handleInputChange}
              sx={{ marginBottom: "15px" }}
            />
            <TextField
              fullWidth
              label="Field"
              name="field"
              value={investorData.field}
              onChange={handleInputChange}
              sx={{ marginBottom: "15px" }}
            />
            <TextField
              fullWidth
              label="Total Investment"
              name="totalInvestment"
              value={investorData.totalInvestment}
              onChange={handleInputChange}
              sx={{ marginBottom: "15px" }}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button type="submit" variant="contained" fullWidth>
              Add Investor
            </Button>
          </form>
        </Box>
      </Grid>

      {/* Investor Profiles on the Right */}
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" component="h2" gutterBottom>
          Investor Profiles
        </Typography>
        <Grid container spacing={3}>
          {investors.map((investor, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: "auto", maxHeight: "auto", boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://i.imgur.com/gDjslG9.jpg" // Default image
                  alt={`Photo of ${investor.name}`}
                  sx={{ border: 1, borderColor: "primary.main" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {investor.name}
                  </Typography>
                  <Typography variant="body2">
                    <b>Email:</b> {investor.email}
                  </Typography>
                  <Typography variant="body2">
                    <b>Contact No:</b> {investor.contactNo}
                  </Typography>
                  <Typography variant="body2">
                    <b>Field:</b> {investor.field}
                  </Typography>
                  <Typography variant="body2">
                    <b>Total Investment:</b> {investor.totalInvestment}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default InvestorStartups;
