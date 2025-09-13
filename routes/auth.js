const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register (no encryption)
router.post("/register", async (req, res) => {
  const { email, password, name  } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const user = new User({ email, password, name });
  await user.save();

  res.json({ message: "User registered successfully" });
});

// Login (plain password check)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "24h",
  });

  res.json({ token });
});

module.exports = router;
