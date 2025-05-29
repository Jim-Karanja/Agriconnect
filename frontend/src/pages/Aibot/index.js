import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { getAgriculturalInsight } from "../../api/huggingface";

function AgricultureInsights() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const answer = await getAgriculturalInsight(question);
    setResponse(answer);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f0fdf4",
        fontFamily: "serif",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          bgcolor: "white",
          borderRadius: 4,
          boxShadow: 6,
          display: "flex",
          flexDirection: "column",
          height: "90vh",
        }}
      >
        {/* Header */}
        <Box sx={{ bgcolor: "#06402B", color: "white", p: 3 }}>
          <Typography variant="h4" fontWeight="bold" align="center">
            Agriconnect AI Assistant 
          </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 4 }}>
          <Typography variant="h6" gutterBottom>
            👩‍🌾 Hi there! Ask me anything about agriculture!
          </Typography>

          {response && (
            <Box
              sx={{
                mt: 3,
                p: 3,
                bgcolor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">
                <strong>🧠 Insight:</strong> {response}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Input */}
        <Box sx={{ p: 3, borderTop: "1px solid #e0e0e0" }}>
          <TextField
            multiline
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            placeholder="Ask something, e.g., How to manage pests naturally?"
            variant="outlined"
            sx={{ mb: 2, fontSize: "1.2rem" }}
            InputProps={{
              style: { fontSize: "1.2rem" },
            }}
          />
          <Button
  variant="contained"
  color="primary"
  onClick={askAI}
  disabled={loading}
  sx={{
    width: "180px",         // Reduced width
    py: 1.5,                // Less vertical padding
    fontSize: "1rem",       // Smaller font size
    fontWeight: "bold",
    borderRadius: "1rem",
  }}
>
  {loading ? "Thinking..." : "Send to AI 🤖"}
</Button>

        </Box>
      </Box>
    </Box>
  );
}

export default AgricultureInsights;
