const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(
  process.env.MONGO_URI ,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ DB Connection Error:", err));

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Routes
app.use("/api", authRoutes);

// Protected route
app.get("/api/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, message: "You are authenticated", user: decoded });
  } catch (err) {
    console.log(token)
    res.status(401).json({ message: "Invalid token" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

