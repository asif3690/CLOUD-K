// backend/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { getConnection } = require("../config/db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "super_secret";
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || "8h";
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

const router = express.Router();

// =======================
// Rate Limiter
// =======================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many attempts. Try again later.",
});

// Normalize Oracle rows
function normalizeUser(row) {
  if (!row) return null;
  if (!Array.isArray(row)) return row;

  return {
    USER_ID: row[0],
    USERNAME: row[1],
    PASSWORD: row[2],
    ROLE: row[3],
    EMAIL: row[4],
  };
}

/* ======================================================
   LOGIN
====================================================== */
router.post(
  "/login",
  authLimiter,
  [body("username").notEmpty(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    let conn;

    try {
      conn = await getConnection();

      const result = await conn.execute(
        `SELECT USER_ID, USERNAME, PASSWORD, ROLE, EMAIL 
         FROM USERS WHERE USERNAME = :username`,
        [username]
      );

      if (!result.rows.length)
        return res.status(401).json({ error: "Invalid credentials" });

      const user = normalizeUser(result.rows[0]);

      // Password check
      let valid = false;
      if (user.PASSWORD.startsWith("$2")) {
        valid = await bcrypt.compare(password, user.PASSWORD);
      } else {
        valid = password === user.PASSWORD;
      }

      if (!valid)
        return res.status(401).json({ error: "Invalid credentials" });

      // JWT Token
      const token = jwt.sign(
        {
          userId: user.USER_ID,
          username: user.USERNAME,
          role: user.ROLE,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          username: user.USERNAME,
          role: user.ROLE,
          email: user.EMAIL,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Login failed" });
    } finally {
      if (conn) try { await conn.close(); } catch {}
    }
  }
);

/* ======================================================
   GET ALL RIDERS (Admin / Chef)
====================================================== */
router.get(
  "/riders",
  authenticateToken,
  authorizeRoles("admin", "chef"),
  async (req, res) => {
    let conn;
    try {
      conn = await getConnection();

      const result = await conn.execute(
        `SELECT USER_ID, USERNAME, EMAIL, ROLE
         FROM USERS
         WHERE LOWER(ROLE) = 'rider'
         ORDER BY USERNAME`
      );

      res.json(result.rows);
    } catch (err) {
      console.error("Fetch riders error:", err);
      res.status(500).json({ error: "Failed to load riders" });
    } finally {
      if (conn) try { await conn.close(); } catch {}
    }
  }
);

module.exports = router;
