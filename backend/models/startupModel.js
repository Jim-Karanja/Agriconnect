const mongoose = require("mongoose");

// Define the schema for the startup model
const startupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name of the startup is required
  },
  photo: {
    type: [String], // Array of strings (URLs) for the photo(s)
    required: false, // Ensure photo is provided
  },
  website: {
    type: String,
    required: false, // Website is required
    unique: true, // Ensure the website is unique
  },
  description: {
    type: String,
    required: false, // Description is optional
  },
  locations: {
    type: String,
    required: false, // Locations is optional
  },
  amountRaised: {
    type: String,
    required: false, // Amount raised is optional
  },
  fundingDuration: {
    type: String,
    required: false, // Funded over is optional
  },
});

// Create a model based on the schema
const startupModel = mongoose.model("startups", startupSchema);

// Export the model to be used in other parts of the application
module.exports = startupModel;
