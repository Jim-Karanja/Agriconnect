const express = require("express");
const router = express.Router();
const startupModel = require("../models/startupModel");

// Fetch all startups
router.get("/fetchAll", async (req, res) => {
  try {
    const startups = await startupModel.find();
    return res.status(200).json({
      startups: startups, // Fix the key name to plural for consistency
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Fetch a specific startup by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await startupModel.findById(id); // Use findById instead of find({ _id: id })

    if (!result) {
      return res.status(404).json({
        message: "Startup not found",
      });
    }

    return res.status(200).json({
      startup: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// Add a new startup
router.post("/add", async (req, res) => {
  const { name, photo, website, description, locations, amountRaised, fundedOver } = req.body;

  try {
    // Check if the required fields are provided
    if (!name || !website) {
      return res.status(400).json({ message: "Name and website are required" });
    }

    const newStartup = new startupModel({
      name,
      photo, // This assumes the photo is passed as a URL or array of URLs
      website,
      description,
      locations,
      amountRaised,
      fundedOver,
    });

    // Save the new startup to the database
    await newStartup.save();

    return res.status(201).json({
      message: "Startup added successfully",
      startup: newStartup,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;

