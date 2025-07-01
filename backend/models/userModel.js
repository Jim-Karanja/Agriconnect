const mongoose = require("mongoose");

const USER_ROLES = {
  ADMIN: 'admin',
  INVESTOR: 'investor',
  INNOVATOR: 'innovator'
};

const userSchema = mongoose.Schema({  
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    required: [true, 'User role is required'],
    enum: {
      values: Object.values(USER_ROLES),
      message: 'Role must be admin, investor, or innovator'
    },
    default: USER_ROLES.INNOVATOR
  },
  address: {
    type: String,
    default: "",
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: "male",
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
