// Code reference: https://git.cs.dal.ca/golani/csci-5709-group8-backend/-/blob/main/controller/productController.js

const userModel = require("../models/userModel");

async function signup(req, res) {
  try {
    let { email } = req.body;
    let user = req.body;

    const fetchedUser = await userModel.findOne({
      email,
    });

    if (fetchedUser) {
      res.status(200).send("User exists!");
    }

    let userAdded = await userModel.create(user);
    res.status(200).send(userAdded);
  } catch (error) {
    res.status(500).send({
      message: "Server error:" + error,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Fetch user from the database
    const loggedInUser = await userModel.findOne({ email });

    // Check if user exists
    if (!loggedInUser) {
      return res.status(404).send({
        message: "User not found!",
      });
    }

    // Compare passwords
    if (password === loggedInUser.password) {
      return res.status(200).send({
        message: "User logged in!",
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
    let { password } = req.body;
    await userModel.findOneAndUpdate(
      { email: req.query.email },
      { $set: { password: password } }
    );

    res.status(200).send({
      message: "Password changed",
    });
  } catch (err) {
    res.status(500).send({
      message: "Server error:" + err,
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
    await userModel.findOneAndUpdate(
      { email: req.query.email },
      {
        $set: {
          name: name,
          password: password,
          address: address,
          gender: gender,
        },
      }
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
