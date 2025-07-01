// Code reference: https://git.cs.dal.ca/golani/csci-5709-group8-backend/-/blob/main/controller/productController.js

const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

async function signup(req, res) {
  try {
    const { name, email, password, role, gender, address } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).send({
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        message: "User with this email already exists!",
      });
    }

    // Validate role
    const validRoles = ['admin', 'investor', 'innovator'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).send({
        message: "Invalid role. Must be admin, investor, or innovator",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'innovator', // Default to innovator
      gender: gender || 'male',
      address: address || ''
    };

    const newUser = await userModel.create(userData);
    
    // Don't send password in response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      gender: newUser.gender,
      address: newUser.address,
      createdAt: newUser.createdAt
    };

    res.status(200).send({
      message: "User created successfully!",
      user: userResponse
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).send({
        message: "Validation error",
        errors
      });
    } else {
      res.status(500).send({
        message: "Server error: " + error.message,
      });
    }
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required",
      });
    }

    // Fetch user from the database
    const loggedInUser = await userModel.findOne({ email });

    // Check if user exists
    if (!loggedInUser) {
      return res.status(404).send({
        message: "User not found!",
      });
    }

    // Check if user is active
    if (!loggedInUser.isActive) {
      return res.status(403).send({
        message: "Account is deactivated. Please contact administrator.",
      });
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, loggedInUser.password);
    if (isPasswordValid) {
      // Update last login time
      await userModel.findByIdAndUpdate(loggedInUser._id, {
        lastLogin: new Date()
      });

      // Return user data with role
      const userResponse = {
        _id: loggedInUser._id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        role: loggedInUser.role,
        gender: loggedInUser.gender,
        address: loggedInUser.address,
        lastLogin: new Date()
      };

      return res.status(200).send({
        message: "User logged in successfully!",
        user: userResponse
      });
    } else {
      return res.status(401).send({
        message: "Invalid email or password!",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({
      message: "Server error: " + error.message,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const { password } = req.body;
    const { email } = req.query;

    // Validate input
    if (!email) {
      return res.status(400).send({
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).send({
        message: "New password is required",
      });
    }

    if (password.length < 8) {
      return res.status(400).send({
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password
    const updatedUser = await userModel.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).send({
        message: "Password reset successfully",
      });
    } else {
      res.status(500).send({
        message: "Failed to update password",
      });
    }
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).send({
      message: "Server error: " + err.message,
    });
  }
}

async function fetchUserByEmail(req, res) {
  try {
    let getUser = await userModel.aggregate([
      {
        $match: { email: req.query.email },
      },
    ]);

    res.status(200).send(getUser);
  } catch (err) {
    res.status(500).send({
      message: "Server error:" + err,
    });
  }
}

async function updateUserProfile(req, res) {
  try {
    let { name, password, address, gender } = req.body;
    
    // Prepare update object
    let updateData = {
      name: name,
      address: address,
      gender: gender,
    };
    
    // Hash password if provided
    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }
    
    await userModel.findOneAndUpdate(
      { email: req.query.email },
      { $set: updateData }
    );
    res.status(200).send({
      message: "Profile updated!",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error:" + err,
    });
  }
}

module.exports = {
  signup: signup,
  login: login,
  forgotPassword: forgotPassword,
  fetchUserByEmail: fetchUserByEmail,
  updateUserProfile: updateUserProfile,
};
