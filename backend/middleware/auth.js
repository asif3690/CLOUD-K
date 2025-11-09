// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user; // { username, role }
    next();
  });
}

// Middleware to check user roles
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

if (!allowedRoles.map(r => r.toLowerCase()).includes(req.user.role?.toLowerCase())) {
  return res.status(403).json({ error: "Access denied" });
}


    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles,
  JWT_SECRET
};