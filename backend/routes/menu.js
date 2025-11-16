// backend/routes/menu.js
const express = require("express");
const oracledb = require("oracledb");
const { getConnection } = require("../config/db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

/* ======================================================
   GET ALL MENU ITEMS
====================================================== */
router.get("/", authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    conn.outputFormat = oracledb.OUT_FORMAT_OBJECT;

    const result = await conn.execute(
      `SELECT ITEM_ID, NAME, DESCRIPTION, PRICE, AVAILABLE, CATEGORY,
              CREATED_AT, UPDATED_AT
       FROM MENU_ITEMS
       ORDER BY ITEM_ID`
    );

    const data = result.rows.map((item) => ({
      ...item,
      AVAILABLE: item.AVAILABLE === 1
    }));

    res.json(data);

  } catch (err) {
    console.error("GET /menu error:", err);
    res.status(500).json({ error: "Failed to load menu items" });
  } finally {
    if (conn) await conn.close();
  }
});

/* ======================================================
   ADD MENU ITEM
====================================================== */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "chef"),
  async (req, res) => {
    const body = req.body;

    const NAME = body.NAME;
    const DESCRIPTION = body.DESCRIPTION || null;
    const PRICE = Number(body.PRICE);
    const AVAILABLE = body.AVAILABLE ? 1 : 0;
    const CATEGORY = body.CATEGORY || null;

    if (!NAME || isNaN(PRICE))
      return res.status(400).json({ error: "Name and Price are required" });

    let conn;
    try {
      conn = await getConnection();

      await conn.execute(
        `INSERT INTO MENU_ITEMS
         (ITEM_ID, NAME, DESCRIPTION, PRICE, AVAILABLE, CATEGORY, CREATED_AT)
         VALUES
         (MENU_SEQ.NEXTVAL, :name, :description, :price, :available, :category, SYSTIMESTAMP)`,
        {
          name: NAME,
          description: DESCRIPTION,
          price: PRICE,
          available: AVAILABLE,
          category: CATEGORY
        },
        { autoCommit: true }
      );

      res.json({ message: "Item added successfully" });

    } catch (err) {
      console.error("POST /menu error:", err.message);
      res.status(500).json({ error: "Failed to add menu item" });
    } finally {
      if (conn) await conn.close();
    }
  }
);

/* ======================================================
   UPDATE MENU ITEM
====================================================== */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "chef"),
  async (req, res) => {
    const body = req.body;

    const NAME = body.NAME;
    const DESCRIPTION = body.DESCRIPTION || null;
    const PRICE = Number(body.PRICE);
    const AVAILABLE = body.AVAILABLE ? 1 : 0;
    const CATEGORY = body.CATEGORY || null;

    let conn;
    try {
      conn = await getConnection();

      const result = await conn.execute(
        `UPDATE MENU_ITEMS
         SET NAME = :name,
             DESCRIPTION = :description,
             PRICE = :price,
             AVAILABLE = :available,
             CATEGORY = :category,
             UPDATED_AT = SYSTIMESTAMP
         WHERE ITEM_ID = :id`,
        {
          id: req.params.id,
          name: NAME,
          description: DESCRIPTION,
          price: PRICE,
          available: AVAILABLE,
          category: CATEGORY
        },
        { autoCommit: true }
      );

      if (result.rowsAffected === 0)
        return res.status(404).json({ error: "Item not found" });

      res.json({ message: "Item updated successfully" });

    } catch (err) {
      console.error("PUT /menu error:", err.message);
      res.status(500).json({ error: "Failed to update menu item" });
    } finally {
      if (conn) await conn.close();
    }
  }
);

/* ======================================================
   DELETE MENU ITEM
====================================================== */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "chef"),
  async (req, res) => {
    let conn;
    try {
      conn = await getConnection();

      const result = await conn.execute(
        `DELETE FROM MENU_ITEMS WHERE ITEM_ID = :id`,
        { id: req.params.id },
        { autoCommit: true }
      );

      if (result.rowsAffected === 0)
        return res.status(404).json({ error: "Item not found" });

      res.json({ message: "Item deleted successfully" });

    } catch (err) {
      console.error("DELETE /menu error:", err.message);
      res.status(500).json({ error: "Failed to delete item" });
    } finally {
      if (conn) await conn.close();
    }
  }
);

module.exports = router;
