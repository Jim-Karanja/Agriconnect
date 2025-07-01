const mongoose = require("mongoose");

// Define Kenyan agricultural industries for startups
const KENYAN_AGRICULTURAL_INDUSTRIES = [
  "Dairy Farming",
  "Horticulture (Fruits & Vegetables)",
  "Coffee Farming",
  "Tea Farming",
  "Maize & Cereal Production",
  "Poultry Farming",
  "Fish Farming (Aquaculture)",
  "Livestock & Cattle Farming",
  "Flower Farming (Floriculture)",
  "Avocado Farming",
  "Greenhouse Farming",
  "Organic Farming",
  "Agricultural Technology",
  "AgriTech", // Added as alias for Agricultural Technology
  "Farm Equipment & Machinery",
  "Food Processing & Value Addition",
  "Other"
];

// Define Kenyan counties for location validation
const KENYAN_COUNTIES = [
  "Nairobi", "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi",
  "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga",
  "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans-Nzoia",
  "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru",
  "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma",
  "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira"
];

// Define the schema for the startup model
const startupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Startup name is required'],
    trim: true,
    minlength: [2, 'Startup name must be at least 2 characters long'],
    maxlength: [100, 'Startup name cannot exceed 100 characters']
  },
  photo: {
    type: String, // Single string for file path or URL
    required: false, // Optional field
    default: ""
  },
  website: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: function(website) {
        if (!website) return true; // Allow empty website
        try {
          new URL(website);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Please enter a valid website URL'
    }
  },
  description: {
    type: String,
    required: [true, 'Startup description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  industries: {
    type: String,
    required: [true, 'Industry sector is required'],
    enum: {
      values: KENYAN_AGRICULTURAL_INDUSTRIES,
      message: 'Please select a valid agricultural industry'
    }
  },
  locations: {
    type: String,
    required: [true, 'Location is required'],
    enum: {
      values: KENYAN_COUNTIES,
      message: 'Please select a valid Kenyan county'
    }
  },
  amountRaised: {
    type: Number,
    required: false,
    default: 0,
    min: [0, 'Amount raised cannot be negative'],
    max: [1000000000, 'Amount raised cannot exceed KSH 1 billion']
  },
  fundingDuration: {
    type: Number,
    required: false,
    default: 12,
    min: [1, 'Funding duration must be at least 1 month'],
    max: [120, 'Funding duration cannot exceed 120 months (10 years)']
  },
  foundedYear: {
    type: Number,
    required: false,
    min: [2000, 'Founded year cannot be before 2000'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  status: {
    type: String,
    enum: ['Active', 'Seeking Investment', 'Funded', 'Paused'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
startupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static methods for getting enum values
startupSchema.statics.getAgriculturalIndustries = function() {
  return KENYAN_AGRICULTURAL_INDUSTRIES;
};

startupSchema.statics.getKenyanCounties = function() {
  return KENYAN_COUNTIES;
};

// Create a model based on the schema
const startupModel = mongoose.model("startups", startupSchema);

// Export the model to be used in other parts of the application
module.exports = startupModel;
