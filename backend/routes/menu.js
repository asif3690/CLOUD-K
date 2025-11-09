// backend/routes/menu.js
const express = require("express");
const { getConnection } = require("../config/db");
const { mapResult } = require("../utils/oracleHelper");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// GET /api/menu - Get all menu items (authenticated users)
router.get("/", authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ITEM_ID, NAME, DESCRIPTION, PRICE, AVAILABLE, CATEGORY, 
              CREATED_AT, UPDATED_AT 
       FROM MENU_ITEMS 
       ORDER BY CATEGORY, NAME`
    );
    res.json(mapResult(result));
  } catch (err) {
    console.error("GET /menu error:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  } finally {
    if (conn) await conn.close();
  }
});

// GET /api/menu/:id - Get single menu item
router.get("/:id", authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ITEM_ID, NAME, DESCRIPTION, PRICE, AVAILABLE, CATEGORY, 
              CREATED_AT, UPDATED_AT 
       FROM MENU_ITEMS 
       WHERE ITEM_ID = :id`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET /menu/:id error:", err);
    res.status(500).json({ error: "Failed to fetch menu item" });
  } finally {
    if (conn) await conn.close();
  }
});

// POST /api/menu - Add new menu item (admin or chef only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "chef"),
  async (req, res) => {
    const { NAME, DESCRIPTION, PRICE, AVAILABLE, CATEGORY } = req.body || {};
    
    if (!NAME || PRICE === undefined) {
      return res.status(400).json({ error: "Name and Price are required" });
    }

    let conn;
    try {
      conn = await getConnection();
      
      await conn.execute(
        `INSERT INTO MENU_ITEMS (ITEM_ID, NAME, DESCRIPTION, PRICE, AVAILABLE, CATEGORY)
         VALUES (menu_seq.NEXTVAL, :name, :description, :price, :available, :category)`,
        {
          name: NAME,
          description: DESCRIPTION || "",
          price: Number(PRICE),
          available: AVAILABLE ? 1 : 0,
          category: CATEGORY || null
        },
        { autoCommit: true }
      );
      
      res.status(201).json({ message: "Menu item added successfully" });
    } catch (err) {
      console.error("POST /menu error:", err);
      res.status(500).json({ error: "Failed to add menu item" });
    } finally {
      if (conn) await conn.close();
    }
  }
);

// PUT /api/menu/:id - Update menu item (admin or chef only)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "chef"),
  async (req, res) => {
    const { NAME, DESCRIPTION, PRICE, AVAILABLE, CATEGORY } = req.body || {};
    
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
             UPDATED_AT = CURRENT_TIMESTAMP
         WHERE ITEM_ID = :id`,
        {
          name: NAME,
          description: DESCRIPTION || "",
          price: Number(PRICE),
          available: AVAILABLE ? 1 : 0,
          category: CATEGORY || null,
          id: req.params.id
        },
        { autoCommit: true }
      );
      
      if (result.rowsAffected === 0) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      
      res.json({ message: "Menu item updated successfully" });
    } catch (err) {
      console.error("PUT /menu/:id error:", err);
      res.status(500).json({ error: "Failed to update menu item" });
    } finally {
      if (conn) await conn.close();
    }
  }
);

// DELETE /api/menu/:id - Delete menu item (admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    let conn;
    try {
      conn = await getConnection();
      
      const result = await conn.execute(
        `DELETE FROM MENU_ITEMS WHERE ITEM_ID = :id`,
        [req.params.id],
        { autoCommit: true }
      );
      
      if (result.rowsAffected === 0) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      
      res.json({ message: "Menu item deleted successfully" });
    } catch (err) {
      console.error("DELETE /menu/:id error:", err);
      res.status(500).json({ error: "Failed to delete menu item" });
    } finally {
      if (conn) await conn.close();
    }
  }
);

module.exports = router;