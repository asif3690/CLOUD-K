// backend/routes/orders.js
const express = require("express");
const oracledb = require("oracledb");
const { getConnection } = require("../config/db");
const { mapResult } = require("../utils/oracleHelper");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

/* ======================================================
   GET ALL ORDERS
====================================================== */
router.get("/", authenticateToken, async (req, res) => {
  const { role, username } = req.user;

  let conn;
  try {
    conn = await getConnection();
    let result;

    if (role === "admin" || role === "chef") {
      result = await conn.execute(
        `SELECT * FROM ORDERS ORDER BY ORDER_DATE DESC`
      );
    } else if (role === "rider") {
      result = await conn.execute(
        `SELECT * FROM ORDERS 
         WHERE RIDER = :username 
         ORDER BY ORDER_DATE DESC`,
        [username]
      );
    } else {
      result = await conn.execute(
        `SELECT * FROM ORDERS 
         WHERE USERNAME = :username 
         ORDER BY ORDER_DATE DESC`,
        [username]
      );
    }

    res.json(mapResult(result));
  } catch (err) {
    console.error("GET /orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  } finally {
    if (conn) try { await conn.close(); } catch {}
  }
});

/* ======================================================
   ASSIGN RIDER (Admin/Chef)
====================================================== */
router.put(
  "/:id/assign",
  authenticateToken,
  authorizeRoles("admin", "chef"),
  async (req, res) => {
    const { rider } = req.body;

    if (!rider)
      return res.status(400).json({ error: "Rider username required" });

    let conn;
    try {
      conn = await getConnection();

      const result = await conn.execute(
        `UPDATE ORDERS
         SET RIDER = :rider, STATUS = 'assigned'
         WHERE ORDER_ID = :id`,
        { rider, id: req.params.id },
        { autoCommit: true }
      );

      if (result.rowsAffected === 0)
        return res.status(404).json({ error: "Order not found" });

      res.json({ message: "Rider assigned successfully" });
    } catch (err) {
      console.error("Assign rider error:", err);
      res.status(500).json({ error: "Failed to assign rider" });
    }
  }
);

/* ======================================================
   RIDER STATUS UPDATE
====================================================== */
router.put(
  "/:id/rider-status",
  authenticateToken,
  authorizeRoles("rider"),
  async (req, res) => {
    const { status } = req.body;
    const allowed = ["picked", "delivering", "delivered"];

    if (!allowed.includes(status))
      return res.status(400).json({ error: "Invalid status" });

    let conn;
    try {
      conn = await getConnection();

      const result = await conn.execute(
        `UPDATE ORDERS
         SET STATUS = :status
         WHERE ORDER_ID = :id AND RIDER = :rider`,
        { status, id: req.params.id, rider: req.user.username },
        { autoCommit: true }
      );

      if (result.rowsAffected === 0)
        return res.status(403).json({ error: "Not allowed" });

      res.json({ message: "Status updated" });
    } catch (err) {
      console.error("Rider update error:", err);
      res.status(500).json({ error: "Failed to update status" });
    }
  }
);

module.exports = router;
