const mongoose = require("mongoose");

// Define Kenyan agricultural investment fields
const KENYAN_AGRICULTURAL_FIELDS = [
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
  "Farm Equipment & Machinery",
  "Food Processing & Value Addition",
  "Other"
];

const investorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Investor name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  photo: {
    type: Array,
    default: []
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  field: {
    type: String,
    required: [true, 'Investment field is required'],
    enum: {
      values: KENYAN_AGRICULTURAL_FIELDS,
      message: 'Please select a valid agricultural sector'
    }
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
    match: [/^[+]?[0-9]{10,15}$/, 'Please enter a valid contact number']
  },
  totalInvestment: {
    type: Number,
    required: [true, 'Total investment capacity is required'],
    min: [1000, 'Minimum investment capacity is KSH 1,000'],
    max: [1000000000, 'Maximum investment capacity is KSH 1 billion']
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
investorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Export the agricultural fields for use in other parts of the application
investorSchema.statics.getAgriculturalFields = function() {
  return KENYAN_AGRICULTURAL_FIELDS;
};

module.exports = mongoose.model("investors", investorSchema);
