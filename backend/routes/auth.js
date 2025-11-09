// backend/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getConnection } = require("../config/db");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// =======================
// POST /api/auth/login
// =======================
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  let conn;
  try {
    conn = await getConnection();

    // Query user from database
    const result = await conn.execute(
      `SELECT USER_ID, USERNAME, PASSWORD, ROLE, EMAIL 
       FROM USERS 
       WHERE USERNAME = :username`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare password
    let isPasswordValid;
    if (user.PASSWORD.startsWith("$2a$") || user.PASSWORD.startsWith("$2b$")) {
      isPasswordValid = await bcrypt.compare(password, user.PASSWORD);
    } else {
      isPasswordValid = password === user.PASSWORD;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.USER_ID,
        username: user.USERNAME,
        role: user.ROLE,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      expiresIn: "8h",
      user: { username: user.USERNAME, role: user.ROLE },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  } finally {
    if (conn) await conn.close();
  }
});

// =======================
// POST /api/auth/register
// =======================
router.post("/register", async (req, res) => {
  const { username, password, email, role } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  let conn;
  try {
    conn = await getConnection();

    // Check if username already exists
    const checkResult = await conn.execute(
      `SELECT USERNAME FROM USERS WHERE USERNAME = :username`,
      [username]
    );

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await conn.execute(
      `INSERT INTO USERS (USER_ID, USERNAME, PASSWORD, EMAIL, ROLE) 
       VALUES (user_seq.NEXTVAL, :username, :password, :email, :role)`,
      [username, hashedPassword, email || null, role || "customer"],
      { autoCommit: true }
    );

    res.status(201).json({
      message: "Registration successful",
      user: {
        username,
        role: role || "customer",
        email,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  } finally {
    if (conn) await conn.close();
  }
});

// =======================
// POST /api/auth/logout
// =======================
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

module.exports = router;
