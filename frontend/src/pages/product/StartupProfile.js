import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Paper,
  Container,
  Grid,
  Divider,
  Avatar,
  IconButton,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AnalysisIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const socket = io("http://localhost:8080");
const DISCOUNT_RATE = 0.1;

function StartupProfile() {
  const [startupList, setStartupList] = useState([]);
  const [startupData, setStartupData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    website: "",
    description: "",
    industries: "",
    locations: "",
    amountRaised: "",
    fundingDuration: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [analysisForm, setAnalysisForm] = useState({
    projectCost: "",
    expectedReturn: "",
    duration: "",
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    socket.emit("get_startups");
    socket.on("startups_data", (data) => setStartupList(data.startups || []));
    socket.on("new_startup", (data) => setStartupList((prevList) => [...prevList, data.startup]));
    
    // Fetch dropdown options
    const fetchDropdownData = async () => {
      try {
        setDropdownLoading(true);
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
        setDropdownLoading(false);
      }
    };

    fetchDropdownData();
    
    return () => {
      socket.off("startups_data");
      socket.off("new_startup");
    };
  }, []);

  const handleSelectStartup = (startupId) => {
    const selected = startupList.find((s) => s._id === startupId);
    setStartupData(selected);
    setAnalysisForm({
      projectCost: selected.amountRaised || "",
      expectedReturn: (parseFloat(selected.amountRaised || 0) * 1.5).toFixed(2),
      duration: selected.fundingDuration || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("add_startup", formData);
    setMessage("Startup added successfully!");
    setFormData({
      name: "",
      photo: "",
      website: "",
      description: "",
      industries: "",
      locations: "",
      amountRaised: "",
      fundingDuration: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalysisChange = (e) => {
    setAnalysisForm({ ...analysisForm, [e.target.name]: e.target.value });
  };

  const analyzeInvestment = () => {
    const cost = parseFloat(analysisForm.projectCost);
    const expected = parseFloat(analysisForm.expectedReturn);
    const duration = parseInt(analysisForm.duration);

    if (isNaN(cost) || isNaN(expected) || isNaN(duration) || duration <= 0) {
      alert("Please enter valid numerical values.");
      return;
    }

    const roi = ((expected - cost) / cost) * 100;
    const risk = roi > 50 ? "Low" : roi > 20 ? "Moderate" : roi > 0 ? "High" : "Very High";
    const annualReturn = expected / duration;
    let npv = -cost;
    for (let t = 1; t <= duration; t++) {
      npv += annualReturn / Math.pow(1 + DISCOUNT_RATE, t);
    }

    let cumulative = 0;
    let paybackPeriod = null;
    for (let t = 1; t <= duration; t++) {
      cumulative += annualReturn;
      if (cumulative >= cost && paybackPeriod === null) paybackPeriod = t;
    }

    const data = [];
    let cumulativeCashFlow = -cost;
    for (let year = 1; year <= duration; year++) {
      cumulativeCashFlow += annualReturn;
      data.push({
        year: `Year ${year}`,
        value: parseFloat(cumulativeCashFlow.toFixed(2)),
      });
    }

    setAnalysisResult({
      roi: roi.toFixed(2),
      risk,
      npv: npv.toFixed(2),
      paybackPeriod,
    });
    setChartData(data);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2D3748', mb: 3 }}>
        Startup Portfolio
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, backgroundColor: '#f0f4f8', borderRadius: 1, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add a New Startup
            </Typography>
            {message && (
              <Alert severity={messageType} sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}
            
            {dropdownLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 1 }}>Loading...</Typography>
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
                  variant="outlined"
                  required
                />
                
                <TextField
                  label="Website (Optional)"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  placeholder="https://yourwebsite.com"
                />
                
                <TextField
                  label="Description *"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
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
                  variant="outlined"
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
                  variant="outlined"
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
                  variant="outlined"
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
                  variant="outlined"
                  placeholder="e.g., 12"
                />
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  sx={{ 
                    mt: 2, 
                    backgroundColor: '#2D3748', 
                    color: 'white', 
                    '&:hover': { backgroundColor: '#1A202C' } 
                  }}
                  size="large"
                >
                  Add Startup
                </Button>
              </form>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Existing Startups
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                {startupList.map((startup) => (
                  <Grid item xs={12} sm={6} md={4} key={startup._id}>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Avatar sx={{ backgroundColor: '#2D3748', mb: 2 }}>{startup.name[0]}</Avatar>
                        <Typography variant="h6">{startup.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {startup.description}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Website: <a href={startup.website} style={{ color: '#3182CE' }}>{startup.website}</a>
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing>
                        <IconButton aria-label="edit startup" onClick={() => handleSelectStartup(startup._id)}>
                          <EditIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>

          {startupData && (
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Details for {startupData.name}</Typography>
              <Typography variant="body1">{startupData.description}</Typography>
              <Typography variant="body1">Website: <a href={startupData.website} target="_blank" rel="noopener noreferrer">{startupData.website}</a></Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Card sx={{ mt: 4, p: 2, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>Investment Analysis</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            label="Project Cost (KES)"
            name="projectCost"
            value={analysisForm.projectCost}
            onChange={handleAnalysisChange}
            fullWidth
          />
          <TextField
            label="Expected Return (KES)"
            name="expectedReturn"
            value={analysisForm.expectedReturn}
            onChange={handleAnalysisChange}
            fullWidth
          />
          <TextField
            label="Duration (Years)"
            name="duration"
            value={analysisForm.duration}
            onChange={handleAnalysisChange}
            fullWidth
          />
          <Button onClick={analyzeInvestment} variant="contained" sx={{ backgroundColor: '#38B2AC', color: 'white', '&:hover': { backgroundColor: '#319795' } }}>
            Analyze
          </Button>
        </Box>

        {analysisResult && (
          <Box>
            <Typography>ROI: {analysisResult.roi}%</Typography>
            <Typography>Risk Level: {analysisResult.risk}</Typography>
            <Typography>NPV: KES {analysisResult.npv}</Typography>
            <Typography>Payback Period: {analysisResult.paybackPeriod} year(s)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="value" stroke="#3182CE" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Card>
    </Container>
  );
}

export default StartupProfile;
