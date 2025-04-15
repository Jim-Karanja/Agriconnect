import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const socket = io("http://localhost:8080");
const DISCOUNT_RATE = 0.1;

function App() {
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
  const [analysisForm, setAnalysisForm] = useState({
    projectCost: "",
    expectedReturn: "",
    duration: "",
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    socket.emit("get_startups");
    socket.on("startups_data", (data) => setStartupList(data.startups));
    socket.on("new_startup", (data) => setStartupList((prevList) => [...prevList, data.startup]));
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
      expectedReturn: parseFloat(selected.amountRaised || 0) * 1.5 + "",
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
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: "brown" }}>Agrinetwork Startups</h1>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
              <input
                key={key}
                type="text"
                name={key}
                placeholder={key.replace(/([A-Z])/g, " $1")}
                value={formData[key]}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: "10px", padding: "10px", fontSize: "16px" }}
              />
            ))}
            <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white" }}>
              Add Startup
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ color: "brown" }}>Startups</h3>
          {startupList.map((startup) => (
            <div
              key={startup._id}
              onClick={() => handleSelectStartup(startup._id)}
              style={{ border: "1px solid #ddd", marginBottom: "10px", padding: "10px", cursor: "pointer" }}
            >
              <h4 style={{ backgroundColor: "chocolate", padding: "10px", borderRadius: "5px", textAlign: "center" }}>
                {startup.name}
              </h4>
              <p style={{ fontSize: "18px", color: "gray" }}>{startup.description}</p>
            </div>
          ))}
        </div>

        {startupData && (
          <div style={{ flex: 1 }}>
            <h4 style={{ color: "green" }}>Details for {startupData.name}</h4>
            <p>{startupData.description}</p>
            <p><strong>Website:</strong> <a href={startupData.website}>{startupData.website}</a></p>
          </div>
        )}
      </div>

      <Card sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Investment Analysis
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          <TextField
            label="Project Cost (KES)"
            name="projectCost"
            value={analysisForm.projectCost}
            onChange={handleAnalysisChange}
          />
          <TextField
            label="Expected Return (KES)"
            name="expectedReturn"
            value={analysisForm.expectedReturn}
            onChange={handleAnalysisChange}
          />
          <TextField
            label="Duration (Years)"
            name="duration"
            value={analysisForm.duration}
            onChange={handleAnalysisChange}
          />
          <Button onClick={analyzeInvestment} variant="contained" color="primary">
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
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Card>
    </div>
  );
}

export default App;
