const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const multer = require("multer");
const path = require("path");

// Routers
const userRouter = require("./routers/userRouter");
const startupRouter = require("./routers/startupRouter");

// Import models
const Investor = require("./models/investorModel");
const Startup = require("./models/startupModel"); // Import the Startup model

// MongoDB URI
const mongoURI = "mongodb://localhost:27017/agrinetwork";

// Connect to MongoDB (check if already connected)
if (mongoose.connection.readyState === 0) {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("Connected to MongoDB");
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
  methods: ["GET", "POST"],
  credentials: true,
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
      totalInvestment,
    });

    await newInvestor.save();
    res.status(201).json({ message: "Investor added successfully!", investor: newInvestor });
  } catch (error) {
    console.error("Error adding investor:", error);
    res.status(500).json({ message: "Error adding investor." });
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
    const newStartup = new Startup({
      name,
      photo,
      website,
      description,
      industries,
      locations,
      amountRaised,
      fundingDuration,
    });

    await newStartup.save();
    io.emit("new_startup", { startup: newStartup });

    res.status(201).json({ message: "Startup added successfully!", startup: newStartup });
  } catch (error) {
    console.error("Error adding startup:", error);
    res.status(500).json({ message: "Error adding startup" });
  }
});

// Use the user and startup routers
app.use("/users", userRouter);
app.use("/startups", startupRouter);

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
