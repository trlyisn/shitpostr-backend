// This must be the first line to ensure environment variables are available
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authMiddleware = require("./middleware/auth"); // Import our middleware
const User = require("./models/User"); // Import User model for the protected route

const app = express();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the app to accept JSON in the request body

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));

// --- Routes ---
app.get("/", (req, res) => {
  res.send("API is alive!");
});

// Use the authentication routes we created
app.use("/api/auth", require("./routes/auth"));

// --- Example of a Protected Route ---
// This route is protected. Only users with a valid token can access it.
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    // The user's id is available in req.user.id because of the authMiddleware
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
