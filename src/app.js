// src/app.js
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const chatRoutes = require("./routes/chat");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Simple rate limiter - adjust as needed
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use("/api/chat", chatRoutes);

// Basic healthcheck
app.get("/", (req, res) => res.json({ status: "ok", service: "ShadowGPT API" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

module.exports = app;
