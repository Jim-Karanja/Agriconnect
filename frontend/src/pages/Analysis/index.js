import React, { useState } from "react";
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

// Discount rate for NPV (can be dynamic)
const DISCOUNT_RATE = 0.1;

function InvestmentAnalysis() {
  const [formData, setFormData] = useState({
    projectCost: "",
    expectedReturn: "",
    duration: "",
  });

  const [analysisResult, setAnalysisResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const analyzeInvestment = () => {
    const cost = parseFloat(formData.projectCost);
    const expected = parseFloat(formData.expectedReturn);
    const duration = parseInt(formData.duration);

    if (isNaN(cost) || isNaN(expected) || isNaN(duration) || duration <= 0) {
      alert("Please enter valid numerical values.");
      return;
    }

    const roi = ((expected - cost) / cost) * 100;
    const risk =
      roi > 50 ? "Low" : roi > 20 ? "Moderate" : roi > 0 ? "High" : "Very High";

    // Annual cash flow
    const annualReturn = expected / duration;

    // NPV calculation
    let npv = -cost;
    for (let t = 1; t <= duration; t++) {
      npv += annualReturn / Math.pow(1 + DISCOUNT_RATE, t);
    }

    // Payback period
    let cumulative = 0;
    let paybackPeriod = null;
    for (let t = 1; t <= duration; t++) {
      cumulative += annualReturn;
      if (cumulative >= cost && paybackPeriod === null) {
        paybackPeriod = t;
      }
    }

    // Chart data
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

  const exportToCSV = () => {
    const headers = "Year,Cumulative Value\n";
    const rows = chartData.map((row) => `${row.year},${row.value}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "investment_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card sx={{ mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Investment Analysis
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Project Cost (KES)"
          name="projectCost"
          value={formData.projectCost}
          onChange={handleChange}
        />
        <TextField
          label="Expected Return (KES)"
          name="expectedReturn"
          value={formData.expectedReturn}
          onChange={handleChange}
        />
        <TextField
          label="Duration (Years)"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
        <Button variant="contained" onClick={analyzeInvestment}>
          Analyze
        </Button>
        <Button variant="outlined" onClick={exportToCSV}>
          Export to CSV
        </Button>
      </Box>

      {analysisResult && (
        <Box>
          <Typography><strong>ROI:</strong> {analysisResult.roi}%</Typography>
          <Typography><strong>Risk Level:</strong> {analysisResult.risk}</Typography>
          <Typography><strong>NPV:</strong> KES {analysisResult.npv}</Typography>
          <Typography>
            <strong>Payback Period:</strong>{" "}
            {analysisResult.paybackPeriod
              ? `${analysisResult.paybackPeriod} year(s)`
              : "Not achievable within timeframe"}
          </Typography>

          <Box sx={{ height: 300, mt: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="value" stroke="#2e7d32" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      )}
    </Card>
  );
}

export default InvestmentAnalysis;
