// auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const router = express.Router();
console.log("server is running");

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, {
  dbName: "UsedBikeDB",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model("RegisteredUser", {
  username: String,
  password: String,
});

// Registration route
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // For simplicity, we're not checking the password here
    // You might want to add your own logic for password validation

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, "your_secret_key");
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Logout route (just an example, actual implementation depends on your use case)
router.post("/logout", (req, res) => {
  // Implement your logout logic here
  res.json({ success: true, message: "Logout successful" });
});

module.exports = { router, User };
