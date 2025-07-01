import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, Typography, Box, MenuItem, Alert, CircularProgress } from "@mui/material";

function AddStartup() {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    industries: "",
    locations: "",
    amountRaised: "",
    fundingDuration: "",
  });
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dropdown options on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);
        const [industriesResponse, locationsResponse] = await Promise.all([
          axios.get("http://localhost:8080/startup-industries"),
          axios.get("http://localhost:8080/startup-locations")
        ]);
        
        setIndustries(industriesResponse.data.industries || []);
        setLocations(locationsResponse.data.locations || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setMessage("Error loading form options. Please refresh the page.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.description || !formData.industries || !formData.locations) {
      setMessage("Please fill in all required fields (name, description, industry, and location).");
      setMessageType("error");
      return;
    }
    
    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("industries", formData.industries);
    submitData.append("locations", formData.locations);
    
    // Add optional fields only if they have values
    if (formData.website && formData.website.trim()) {
      submitData.append("website", formData.website.trim());
    }
    if (formData.amountRaised && formData.amountRaised.trim()) {
      submitData.append("amountRaised", formData.amountRaised);
    }
    if (formData.fundingDuration && formData.fundingDuration.trim()) {
      submitData.append("fundingDuration", formData.fundingDuration);
    }
    if (photo) {
      submitData.append("photo", photo);
    }
    
    try {
      const response = await axios.post("http://localhost:8080/startups/add", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setMessage("Startup added successfully!");
      setMessageType("success");
      console.log("Response:", response.data);
      
      // Reset form
      setFormData({
        name: "",
        website: "",
        description: "",
        industries: "",
        locations: "",
        amountRaised: "",
        fundingDuration: "",
      });
      setPhoto(null);
      
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setMessage("Error adding startup! " + (error.response?.data?.message || error.message));
      setMessageType("error");
      console.error("Error:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Add New Startup</Typography>
      
      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading form options...</Typography>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Startup Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Website (Optional)"
            name="website"
            value={formData.website}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="https://yourwebsite.com"
          />
          
          <TextField
            label="Description *"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          
          <TextField
            select
            label="Industry *"
            name="industries"
            value={formData.industries}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={industries.length === 0}
          >
            {industries.map((industry) => (
              <MenuItem key={industry} value={industry}>
                {industry}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            label="Location *"
            name="locations"
            value={formData.locations}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={locations.length === 0}
          >
            {locations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="Amount Raised (KSH) (Optional)"
            name="amountRaised"
            type="number"
            value={formData.amountRaised}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="e.g., 500000"
          />
          
          <TextField
            label="Funding Duration (Months) (Optional)"
            name="fundingDuration"
            type="number"
            value={formData.fundingDuration}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="e.g., 12"
          />
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Photo (Optional)</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: '100%' }}
            />
          </Box>
          
          <Button type="submit" variant="contained" sx={{ mt: 2 }} size="large">
            Add Startup
          </Button>
        </form>
      )}
    </Box>
  );
}

export default AddStartup;
