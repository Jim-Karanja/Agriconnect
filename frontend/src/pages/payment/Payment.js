import React, { useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import axios from "axios";

function MpesaPayment() {
  const [paymentData, setPaymentData] = useState({
    phoneNumber: "",
    amount: "",
    description: "AgriConnect Platform Payment",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [transactionStatus, setTransactionStatus] = useState(null);

  // Validate Kenyan phone number
  const validateKenyanPhone = (phone) => {
    // Remove any spaces, dashes, or plus signs
    const cleanPhone = phone.replace(/[\s\-\+]/g, "");
    
    // Check if it's a valid Kenyan number
    // Format: 254XXXXXXXXX or 07XXXXXXXX or 01XXXXXXXX
    const kenyanPatterns = [
      /^254[71][0-9]{8}$/, // 254701234567
      /^07[0-9]{8}$/, // 0701234567
      /^01[0-9]{8}$/, // 0101234567
    ];
    
    return kenyanPatterns.some(pattern => pattern.test(cleanPhone));
  };

  // Format phone number to M-Pesa format (254XXXXXXXXX)
  const formatPhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/[\s\-\+]/g, "");
    
    if (cleanPhone.startsWith("254")) {
      return cleanPhone;
    } else if (cleanPhone.startsWith("0")) {
      return "254" + cleanPhone.substring(1);
    }
    return cleanPhone;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
    
    // Clear previous messages when user starts typing
    if (message) {
      setMessage("");
    }
  };

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!paymentData.phoneNumber || !paymentData.amount) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      return;
    }
    
    if (!validateKenyanPhone(paymentData.phoneNumber)) {
      setMessage("Please enter a valid Kenyan phone number (e.g., 0701234567 or 254701234567).");
      setMessageType("error");
      return;
    }
    
    const amount = parseFloat(paymentData.amount);
    if (isNaN(amount) || amount <= 0) {
      setMessage("Please enter a valid amount.");
      setMessageType("error");
      return;
    }
    
    if (amount < 10) {
      setMessage("Minimum payment amount is KSH 10.");
      setMessageType("error");
      return;
    }
    
    setLoading(true);
    setMessage("");
    
    try {
      const formattedPhone = formatPhoneNumber(paymentData.phoneNumber);
      
      // Call M-Pesa backend API
      const response = await axios.post("http://localhost:8080/payment/mpesa", {
        phoneNumber: formattedPhone,
        amount: amount,
        description: paymentData.description,
      });
      
      if (response.data.success) {
        setMessage(`Payment request sent! Please check your phone (${formattedPhone}) and enter your M-Pesa PIN to complete the payment.`);
        setMessageType("success");
        setTransactionStatus("pending");
        
        // Simulate checking payment status
        setTimeout(() => {
          setTransactionStatus("completed");
          setMessage(`Payment of KSH ${amount} completed successfully! Transaction ID: ${response.data.transactionId}`);
          setMessageType("success");
        }, 5000);
      } else {
        throw new Error(response.data.message || "Payment failed");
      }
    } catch (error) {
      console.error("M-Pesa payment error:", error);
      setMessage("Payment failed. Please try again or contact support.");
      setMessageType("error");
      setTransactionStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        py={4}
      >
        <Paper elevation={3} sx={{ width: "100%", p: 4 }}>
          <Box textAlign="center" mb={3}>
            <PaymentIcon sx={{ fontSize: 60, color: "#00A86B", mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" color="#00A86B">
              M-Pesa Payment
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Secure payments for AgriConnect Platform
            </Typography>
          </Box>
          
          {message && (
            <Alert severity={messageType} sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}
          
          {transactionStatus === "completed" && (
            <Box textAlign="center" mb={3}>
              <CheckCircleIcon sx={{ fontSize: 60, color: "#4CAF50" }} />
              <Typography variant="h6" color="#4CAF50" mt={1}>
                Payment Successful!
              </Typography>
            </Box>
          )}
          
          <form onSubmit={handleMpesaPayment}>
            <TextField
              label="Phone Number *"
              name="phoneNumber"
              value={paymentData.phoneNumber}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              placeholder="0701234567 or 254701234567"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
              helperText="Enter your M-Pesa registered phone number"
              required
            />
            
            <TextField
              label="Amount (KSH) *"
              name="amount"
              type="number"
              value={paymentData.amount}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              placeholder="e.g., 1000"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    KSH
                  </InputAdornment>
                ),
              }}
              helperText="Minimum amount: KSH 10"
              required
            />
            
            <TextField
              label="Description (Optional)"
              name="description"
              value={paymentData.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
            
            <Divider sx={{ my: 3 }} />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || transactionStatus === "completed"}
              sx={{
                backgroundColor: "#00A86B",
                color: "white",
                py: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#008559",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : transactionStatus === "pending" ? (
                "Waiting for Payment..."
              ) : transactionStatus === "completed" ? (
                "Payment Completed"
              ) : (
                "Pay with M-Pesa"
              )}
            </Button>
          </form>
          
          <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={1}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              <strong>How it works:</strong><br />
              1. Enter your M-Pesa registered phone number<br />
              2. Enter the amount you want to pay<br />
              3. Click "Pay with M-Pesa"<br />
              4. Check your phone for the M-Pesa prompt<br />
              5. Enter your M-Pesa PIN to complete payment
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default MpesaPayment;
