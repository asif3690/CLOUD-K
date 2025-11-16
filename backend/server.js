// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 5000;

// ============= CORS =============
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : ["http://localhost:5173"],
    credentials: true,
  })
);

// ============= Middleware =============
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// ============= API Routes =============
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// ============= Health Route =============
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Cloud Kitchen API Running",
    timestamp: new Date().toISOString(),
  });
});

// ============= Root =============
app.get("/", (req, res) => {
  res.json({
    message: "Cloud Kitchen Management System API",
    endpoints: {
      auth: "/api/auth",
      menu: "/api/menu",
      orders: "/api/orders",
      health: "/api/health",
    },
  });
});

// ============= 404 Handler =============
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ============= Start Server =============
async function startServer() {
  try {
    console.log("Connecting to Oracle...");
    await db.initialize();

    console.log("Database connected successfully!");
  } catch (err) {
    console.log("Database connection failed:", err.message);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
}

startServer();
