const express = require("express");
const router = express.Router();
const Investor = require("../models/investorModel");
const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists in your project
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to fetch an investor by email
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const investor = await Investor.findOne({ email });

    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    res.status(200).json({ investor });
  } catch (error) {
    console.error("Error fetching investor:", error);
    res.status(500).json({ message: "Server error while fetching investor" });
  }
});

// Route to create a new investor (with photo upload)
router.post("/create", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, field, contactNo, totalInvestment } = req.body;
    const photo = req.file ? req.file.path : null;

    // Check if investor already exists
    const existingInvestor = await Investor.findOne({ email });
    if (existingInvestor) {
      return res.status(400).json({ message: "Investor with this email already exists" });
    }

    // Create new investor
    const newInvestor = new Investor({
      name,
      email,
      field,
      contactNo,
      totalInvestment,
      photo: photo ? [photo] : [],
    });

    await newInvestor.save();
    res.status(201).json({
      message: "Investor profile created successfully",
      investor: newInvestor,
    });
  } catch (error) {
    console.error("Error creating investor:", error);
    res.status(500).json({ message: "Server error while creating investor" });
  }
});

module.exports = router;
