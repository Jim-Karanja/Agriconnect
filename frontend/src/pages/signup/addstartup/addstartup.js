import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, Box } from "@mui/material";

function AddStartup() {
  const [formData, setFormData] = useState({
    name: "",
    photo: [],
    website: "",
    description: "",
    industries: "",
    locations: "",
    amountRaised: "",
    fundedOver: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/startups", formData)
      .then((response) => {
        setMessage("Startup added successfully!");
        console.log("Response:", response.data);
        setFormData({
          name: "",
          photo: [],
          website: "",
          description: "",
          industries: "",
          locations: "",
          amountRaised: "",
          fundedOver: "",
        });
      })
      .catch((error) => {
        setMessage("Error adding startup!");
        console.error("Error:", error);
      });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">Add New Startup</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          label="Industries"
          name="industries"
          value={formData.industries}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Locations"
          name="locations"
          value={formData.locations}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount Raised"
          name="amountRaised"
          value={formData.amountRaised}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Funded Over"
          name="fundedOver"
          value={formData.fundedOver}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Add Startup
        </Button>
      </form>
      {message && (
        <Typography variant="subtitle1" sx={{ mt: 2, color: "green" }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default AddStartup;
