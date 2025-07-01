import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fab,
  Tooltip,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccountBalance as InvestmentIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

function InvestorProfile() {
  const [investors, setInvestors] = useState([]);
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [investorData, setInvestorData] = useState({
    name: "",
    email: "",
    contactNo: "",
    field: "",
    totalInvestment: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const investmentFields = [
    "Dairy Farming",
    "Horticulture (Fruits & Vegetables)",
    "Coffee Farming",
    "Tea Farming",
    "Maize & Cereal Production",
    "Poultry Farming",
    "Fish Farming (Aquaculture)",
    "Livestock & Cattle Farming",
    "Flower Farming (Floriculture)",
    "Avocado Farming",
    "Greenhouse Farming",
    "Organic Farming",
    "Agricultural Technology",
    "Farm Equipment & Machinery",
    "Food Processing & Value Addition",
    "Other"
  ];

  // Fetching investors data from backend API
  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/investors");
      setInvestors(response.data.investors);
      setFilteredInvestors(response.data.investors);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching investors:", error);
      setError("Failed to fetch investors. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  // Filter investors based on search and field filter
  useEffect(() => {
    let filtered = investors;
    
    if (searchTerm) {
      filtered = filtered.filter(investor => 
        investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (fieldFilter) {
      filtered = filtered.filter(investor => investor.field === fieldFilter);
    }
    
    setFilteredInvestors(filtered);
  }, [searchTerm, fieldFilter, investors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvestorData({ ...investorData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(investorData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/investors", investorData);
      setSuccess("Investor added successfully!");
      setInvestorData({
        name: "",
        email: "",
        contactNo: "",
        field: "",
        totalInvestment: "",
      });
      setOpenDialog(false);
      fetchInvestors();
    } catch (error) {
      console.error("Error adding investor:", error);
      setError("Failed to add investor. Please try again.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#06402B' }}>
          Investment Partners
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Connect with forward-thinking investors in the Kenyan agricultural sector
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Main Grid - Original Layout: Form Left, Investors Right */}
      <Grid container spacing={4}>
        {/* Investor Form on the Left */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: '#f8fffe' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#06402B', fontWeight: 'bold', mb: 3 }}>
              <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Add New Investor
            </Typography>
            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Investor Name"
                    name="name"
                    value={investorData.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={investorData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contactNo"
                    value={investorData.contactNo}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth required sx={{ mb: 2 }}>
                    <InputLabel>Agricultural Field</InputLabel>
                    <Select
                      name="field"
                      value={investorData.field}
                      label="Agricultural Field"
                      onChange={handleInputChange}
                    >
                      {investmentFields.map((field) => (
                        <MenuItem key={field} value={field}>{field}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Total Investment Capacity (KSH)"
                    name="totalInvestment"
                    type="number"
                    value={investorData.totalInvestment}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <InvestmentIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth
                    size="large"
                    sx={{
                      backgroundColor: '#06402B',
                      '&:hover': {
                        backgroundColor: '#054A33',
                        transform: 'translateY(-2px)',
                      },
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}
                  >
                    Add Investor
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Investor Profiles on the Right */}
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#06402B', fontWeight: 'bold' }}>
              <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Current Investors
            </Typography>
            
            {/* Search and Filter */}
            <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f0fdf4' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search investors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Filter by Field</InputLabel>
                    <Select
                      value={fieldFilter}
                      label="Filter by Field"
                      onChange={(e) => setFieldFilter(e.target.value)}
                    >
                      <MenuItem value="">All Fields</MenuItem>
                      {investmentFields.map((field) => (
                        <MenuItem key={field} value={field}>{field}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Box>
          
          {/* Investors List */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={60} sx={{ color: '#06402B' }} />
            </Box>
          ) : filteredInvestors.length === 0 ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', backgroundColor: '#f9fafb' }}>
              <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No investors found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {investors.length === 0 
                  ? "Be the first to join our investment community!"
                  : "Try adjusting your search criteria."
                }
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredInvestors.map((investor, index) => (
                <Grid item xs={12} sm={6} key={investor._id || index}>
                  <Card 
                    elevation={3} 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                      borderRadius: 3,
                      border: '1px solid #e0f2e7'
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            mr: 2,
                            backgroundColor: '#06402B',
                            fontSize: '1.25rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {getInitials(investor.name)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {investor.name}
                          </Typography>
                          <Chip 
                            label={investor.field} 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                              fontWeight: 'medium'
                            }}
                          />
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, mr: 1, color: '#06402B' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {investor.email}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PhoneIcon sx={{ fontSize: 16, mr: 1, color: '#06402B' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {investor.contactNo}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                          <TrendingUpIcon sx={{ fontSize: 24, mr: 1, color: '#059669' }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#059669' }}>
                            {formatCurrency(investor.totalInvestment)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        href={`mailto:${investor.email}`}
                        startIcon={<EmailIcon />}
                        sx={{
                          borderColor: '#06402B',
                          color: '#06402B',
                          '&:hover': {
                            backgroundColor: '#06402B',
                            color: 'white'
                          }
                        }}
                      >
                        Contact
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Total: {filteredInvestors.length} investor{filteredInvestors.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default InvestorProfile;
