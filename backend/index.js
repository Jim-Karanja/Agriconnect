const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
require('dotenv').config();

// Import M-Pesa service and Transaction model
const MpesaService = require('./services/mpesaService');
const Transaction = require('./models/transactionModel');

// Routers
const userRouter = require("./routers/userRouter");
const startupRouter = require("./routers/startupRouter");

// Import models
const Investor = require("./models/investorModel");
const Startup = require("./models/startupModel"); // Import the Startup model

// MongoDB URI - using cloud database
const mongoURI = 'mongodb+srv://thanjukaranja78:Smejak12%40%40%23%23@cluster0.wpcy5.mongodb.net/agriconnect?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB (check if already connected)
if (mongoose.connection.readyState === 0) {
  mongoose.connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB Cloud Database");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
} else {
  console.log("MongoDB connection already established");
}

const app = express();
const port = process.env.PORT || 8080;

// Middleware to handle image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save to the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp as filename
  },
});

const upload = multer({ storage: storage });

app.use(cors({
  origin: "http://localhost:3000", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads")); // Serve the uploaded files

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  // Emit all startups when a user connects
  Startup.find()
    .then((startups) => {
      socket.emit("startups_data", { startups }); // Emit to the newly connected client
    })
    .catch((error) => {
      console.error("Error fetching startups:", error);
    });

  socket.on("get_startups", () => {
    Startup.find()
      .then((startups) => {
        socket.emit("startups_data", { startups }); // Send startup data to client
      })
      .catch((error) => {
        console.error("Error fetching startups:", error);
      });
  });

  socket.on("send_notification", (data) => {
    socket.broadcast.emit("receive_notification", data);
  });

  socket.on("add_startup", (startupData) => {
    const newStartup = new Startup(startupData);
    newStartup.save()
      .then((startup) => {
        io.emit("new_startup", { startup });
      })
      .catch((error) => {
        console.error("Error adding new startup:", error);
      });
  });
});

// API route to fetch all investors
app.get("/investors", async (req, res) => {
  try {
    const investors = await Investor.find();
    res.json({ investors });
  } catch (error) {
    console.error("Error fetching investors:", error);
    res.status(500).json({ message: "Error fetching investors" });
  }
});

// API route to get agricultural fields for dropdowns
app.get("/agricultural-fields", async (req, res) => {
  try {
    const fields = Investor.getAgriculturalFields();
    res.json({ fields });
  } catch (error) {
    console.error("Error fetching agricultural fields:", error);
    res.status(500).json({ message: "Error fetching agricultural fields" });
  }
});

// API route to get Kenyan counties for dropdowns
app.get("/kenyan-counties", async (req, res) => {
  try {
    const counties = require("./models/startupModel").getKenyanCounties();
    res.json({ counties });
  } catch (error) {
    console.error("Error fetching Kenyan counties:", error);
    res.status(500).json({ message: "Error fetching Kenyan counties" });
  }
});

// API route to get startup industries for dropdowns
app.get("/startup-industries", async (req, res) => {
  try {
    const industries = require("./models/startupModel").getAgriculturalIndustries();
    res.json({ industries });
  } catch (error) {
    console.error("Error fetching startup industries:", error);
    res.status(500).json({ message: "Error fetching startup industries" });
  }
});

// API route to get startup locations (same as counties)
app.get("/startup-locations", async (req, res) => {
  try {
    const locations = require("./models/startupModel").getKenyanCounties();
    res.json({ locations });
  } catch (error) {
    console.error("Error fetching startup locations:", error);
    res.status(500).json({ message: "Error fetching startup locations" });
  }
});

// API route to add a new investor
app.post("/investors", async (req, res) => {
  try {
    const { name, email, contactNo, field, totalInvestment } = req.body;
    if (!name || !email || !contactNo || !field || !totalInvestment) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newInvestor = new Investor({
      name,
      email,
      contactNo,
      field,
      totalInvestment: parseFloat(totalInvestment), // Ensure it's a number
    });

    await newInvestor.save();
    res.status(201).json({ message: "Investor added successfully!", investor: newInvestor });
  } catch (error) {
    console.error("Error adding investor:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: "Validation error", errors });
    } else {
      res.status(500).json({ message: "Error adding investor." });
    }
  }
});

// API route to fetch all startups
app.get("/startups", async (req, res) => {
  try {
    const startups = await Startup.find();
    res.json({ startups });
  } catch (error) {
    console.error("Error fetching startups:", error);
    res.status(500).json({ message: "Error fetching startups" });
  }
});

// API route to add a new startup with image upload
app.post("/startups/add", upload.single("photo"), async (req, res) => {
  try {
    const { name, website, description, industries, locations, amountRaised, fundingDuration } = req.body;
    const photo = req.file ? req.file.path : ""; // Get the path of the uploaded image
    
    // Create startup data object with required fields
    const startupData = {
      name,
      description,
      industries,
      locations
    };
    
    // Add optional fields only if they are provided
    if (photo) startupData.photo = photo;
    if (website && website.trim()) startupData.website = website.trim();
    if (amountRaised && !isNaN(amountRaised)) startupData.amountRaised = parseFloat(amountRaised);
    if (fundingDuration && !isNaN(fundingDuration)) startupData.fundingDuration = parseInt(fundingDuration);
    
    const newStartup = new Startup(startupData);

    await newStartup.save();
    io.emit("new_startup", { startup: newStartup });

    res.status(201).json({ message: "Startup added successfully!", startup: newStartup });
  } catch (error) {
    console.error("Error adding startup:", error);
    res.status(500).json({ message: "Error adding startup" });
  }
});

// Initialize M-Pesa service
const mpesaService = new MpesaService();

// M-Pesa payment endpoint - Real implementation
app.post("/payment/mpesa", async (req, res) => {
  try {
    const { phoneNumber, amount, description, userId } = req.body;
    
    // Validate input
    if (!phoneNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone number and amount are required"
      });
    }
    
    // Validate Kenyan phone number
    const cleanPhone = phoneNumber.replace(/[\s\-\+]/g, "");
    const kenyanPatterns = [
      /^254[71][0-9]{8}$/, // 254701234567
      /^07[0-9]{8}$/, // 0701234567
      /^01[0-9]{8}$/, // 0101234567
    ];
    
    const isValidKenyanPhone = kenyanPatterns.some(pattern => pattern.test(cleanPhone));
    if (!isValidKenyanPhone) {
      return res.status(400).json({
        success: false,
        message: "Invalid Kenyan phone number format"
      });
    }
    
    // Validate amount
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount < 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Minimum is KSH 10"
      });
    }
    
    // Format phone number
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith("0")) {
      formattedPhone = "254" + cleanPhone.substring(1);
    }
    
    // Generate reference number
    const referenceNumber = `AGC${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    console.log("Initiating M-Pesa STK Push:", {
      phone: formattedPhone,
      amount: paymentAmount,
      reference: referenceNumber
    });
    
    // Initiate M-Pesa STK Push
    const mpesaResponse = await mpesaService.initiateSTKPush(
      formattedPhone,
      paymentAmount,
      referenceNumber,
      description || "AgriConnect Platform Payment"
    );
    
    if (!mpesaResponse.success) {
      return res.status(400).json({
        success: false,
        message: mpesaResponse.error || "Failed to initiate payment",
        code: mpesaResponse.code
      });
    }
    
    // Save transaction to database
    const transaction = new Transaction({
      merchantRequestID: mpesaResponse.merchantRequestID,
      checkoutRequestID: mpesaResponse.checkoutRequestID,
      phoneNumber: formattedPhone,
      amount: paymentAmount,
      description: description || "AgriConnect Platform Payment",
      referenceNumber: referenceNumber,
      userId: userId || null,
      metadata: {
        responseCode: mpesaResponse.responseCode,
        responseDescription: mpesaResponse.responseDescription
      }
    });
    
    await transaction.save();
    
    console.log("Transaction saved:", transaction._id);
    
    res.status(200).json({
      success: true,
      message: "Payment request sent successfully. Please check your phone.",
      transactionId: transaction._id,
      checkoutRequestID: mpesaResponse.checkoutRequestID,
      phoneNumber: formattedPhone,
      amount: paymentAmount,
      reference: referenceNumber,
      customerMessage: mpesaResponse.customerMessage,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("M-Pesa payment error:", error);
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: error.message
    });
  }
});

// M-Pesa payment status check endpoint
app.get("/payment/mpesa/status/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Find transaction in database
    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }
    
    // If transaction is still pending, query M-Pesa for latest status
    if (transaction.status === 'pending') {
      const mpesaStatus = await mpesaService.querySTKPushStatus(transaction.checkoutRequestID);
      
      if (mpesaStatus.success && mpesaStatus.resultCode !== undefined) {
        if (mpesaStatus.resultCode === '0') {
          // Payment completed
          transaction.status = 'completed';
          transaction.completedAt = new Date();
          transaction.resultCode = mpesaStatus.resultCode;
          transaction.resultDescription = mpesaStatus.resultDesc;
          await transaction.save();
        } else if (mpesaStatus.resultCode !== '1032') {
          // Payment failed (1032 means still pending)
          transaction.status = 'failed';
          transaction.resultCode = mpesaStatus.resultCode;
          transaction.resultDescription = mpesaStatus.resultDesc;
          await transaction.save();
        }
      }
      
      // Check if transaction is expired
      if (transaction.isExpired()) {
        transaction.status = 'timeout';
        transaction.resultDescription = 'Transaction timed out';
        await transaction.save();
      }
    }
    
    res.status(200).json({
      success: true,
      transactionId: transactionId,
      status: transaction.status,
      amount: transaction.amount,
      phoneNumber: transaction.phoneNumber,
      mpesaReceiptNumber: transaction.mpesaReceiptNumber,
      resultDescription: transaction.resultDescription,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Payment status check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check payment status",
      error: error.message
    });
  }
});

// M-Pesa callback endpoint
app.post("/payment/mpesa/callback", async (req, res) => {
  try {
    console.log("M-Pesa Callback received:", JSON.stringify(req.body, null, 2));
    
    // Validate callback data
    const transactionData = mpesaService.validateCallback(req.body);
    
    if (!transactionData) {
      console.error("Invalid callback data");
      return res.status(400).json({ ResultCode: 1, ResultDesc: "Invalid callback data" });
    }
    
    // Find transaction in database
    const transaction = await Transaction.findOne({
      checkoutRequestID: transactionData.checkoutRequestID
    });
    
    if (!transaction) {
      console.error("Transaction not found for callback:", transactionData.checkoutRequestID);
      return res.status(404).json({ ResultCode: 1, ResultDesc: "Transaction not found" });
    }
    
    // Update transaction based on callback
    if (transactionData.success) {
      await transaction.markCompleted({
        mpesaReceiptNumber: transactionData.mpesaReceiptNumber,
        transactionDate: transactionData.transactionDate
      });
      
      console.log(`Transaction ${transaction._id} marked as completed`);
      
      // Emit socket event for real-time updates
      io.emit('payment_completed', {
        transactionId: transaction._id,
        status: 'completed',
        mpesaReceiptNumber: transactionData.mpesaReceiptNumber
      });
      
    } else {
      await transaction.markFailed(transactionData.resultDesc, transactionData.resultCode);
      
      console.log(`Transaction ${transaction._id} marked as failed:`, transactionData.resultDesc);
      
      // Emit socket event for real-time updates
      io.emit('payment_failed', {
        transactionId: transaction._id,
        status: 'failed',
        reason: transactionData.resultDesc
      });
    }
    
    // Respond to M-Pesa
    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
    
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    res.status(500).json({ ResultCode: 1, ResultDesc: "Internal server error" });
  }
});

// Get transaction history
app.get("/payment/transactions", async (req, res) => {
  try {
    const { phoneNumber, status, limit = 50 } = req.query;
    
    let query = {};
    
    if (phoneNumber) {
      query.phoneNumber = phoneNumber;
    }
    
    if (status) {
      query.status = status;
    }
    
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      transactions: transactions
    });
    
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message
    });
  }
});

// Use the user and startup routers
app.use("/users", userRouter);
app.use("/startups", startupRouter);

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
