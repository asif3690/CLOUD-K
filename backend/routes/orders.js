const oracledb = require('oracledb');
const express = require("express");
const { getConnection } = require("../config/db");
const { mapResult } = require("../utils/oracleHelper");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// GET /api/orders - Get all orders
router.get("/", authenticateToken, async (req, res) => {
  const role = req.user.role;
  const username = req.user.username;
  
  let conn;
  try {
    conn = await getConnection();
    let result;
    
    if (role === "admin" || role === "chef") {
      // Admin and chef can see all orders
      result = await conn.execute(
        `SELECT ORDER_ID, USER_ID, USERNAME, TOTAL_AMOUNT, STATUS, 
                ORDER_DATE, NOTES 
         FROM ORDERS 
         ORDER BY ORDER_DATE DESC`
      );
    } else {
      // Customers can only see their own orders
      result = await conn.execute(
        `SELECT ORDER_ID, USER_ID, USERNAME, TOTAL_AMOUNT, STATUS, 
                ORDER_DATE, NOTES 
         FROM ORDERS 
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
    if (conn) await conn.close();
  }
});

// GET /api/orders/:id - Get single order with items
router.get("/:id", authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    
    // Get order details
    const orderResult = await conn.execute(
      `SELECT ORDER_ID, USER_ID, USERNAME, TOTAL_AMOUNT, STATUS, 
              ORDER_DATE, NOTES 
       FROM ORDERS 
       WHERE ORDER_ID = :id`,
      [req.params.id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const order = orderResult.rows[0];
    
    // Check if user has access to this order
    if (req.user.role !== "admin" && 
        req.user.role !== "chef" && 
        order.USERNAME !== req.user.username) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    // Get order items
    const itemsResult = await conn.execute(
      `SELECT ORDER_ITEM_ID, ITEM_ID, ITEM_NAME, QUANTITY, PRICE, SUBTOTAL 
       FROM ORDER_ITEMS 
       WHERE ORDER_ID = :id`,
      [req.params.id]
    );
    
    order.ITEMS = mapResult(itemsResult);
    
    res.json(order);
  } catch (err) {
    console.error("GET /orders/:id error:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  } finally {
    if (conn) await conn.close();
  }
});

// POST /api/orders - Create new order
router.post("/", authenticateToken, async (req, res) => {
  const { TOTAL_AMOUNT, ITEMS, NOTES } = req.body || {};
  const username = req.user.username;
  const userId = req.user.userId;
  
  if (!TOTAL_AMOUNT || !Array.isArray(ITEMS) || ITEMS.length === 0) {
    return res.status(400).json({ error: "Invalid order payload" });
  }

  let conn;
  try {
    conn = await getConnection();

    // Insert into ORDERS
    const orderResult = await conn.execute(
      `INSERT INTO ORDERS (ORDER_ID, USER_ID, USERNAME, TOTAL_AMOUNT, STATUS, NOTES)
       VALUES (order_seq.NEXTVAL, :userId, :username, :total, 'pending', :notes)
       RETURNING ORDER_ID INTO :orderId`,
      {
        userId: userId,
        username: username,
        total: Number(TOTAL_AMOUNT),
        notes: NOTES || null,
        orderId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    const orderId = orderResult.outBinds.orderId[0];

    // Insert order items
    for (const item of ITEMS) {
      const subtotal = Number(item.PRICE) * Number(item.QUANTITY);
      await conn.execute(
        `INSERT INTO ORDER_ITEMS (ORDER_ITEM_ID, ORDER_ID, ITEM_ID, ITEM_NAME, 
                                   QUANTITY, PRICE, SUBTOTAL)
         VALUES (order_item_seq.NEXTVAL, :orderId, :itemId, :itemName, 
                 :quantity, :price, :subtotal)`,
        {
          orderId: orderId,
          itemId: item.ITEM_ID,
          itemName: item.NAME || item.ITEM_NAME,
          quantity: Number(item.QUANTITY),
          price: Number(item.PRICE),
          subtotal: subtotal
        }
      );
    }

    await conn.commit();
    
    res.status(201).json({ 
      message: "Order created successfully", 
      ORDER_ID: orderId 
    });
  } catch (err) {
    if (conn) {
      try {
        await conn.rollback();
      } catch (rollbackErr) {
        console.error("Rollback error:", rollbackErr);
      }
    }
    console.error("POST /orders error:", err);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    if (conn) await conn.close();
  }
});

// PUT /api/orders/:id/status - Update order status (admin or chef only)
router.put(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin", "chef"),
  async (req, res) => {
    const { STATUS } = req.body || {};
    
    if (!["pending", "processing", "completed", "cancelled"].includes(STATUS)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    let conn;
    try {
      conn = await getConnection();
      
      const result = await conn.execute(
        `UPDATE ORDERS 
         SET STATUS = :status 
         WHERE ORDER_ID = :id`,
        { status: STATUS, id: req.params.id },
        { autoCommit: true }
      );
      
      if (result.rowsAffected === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json({ message: "Order status updated successfully" });
    } catch (err) {
      console.error("PUT /orders/:id/status error:", err);
      res.status(500).json({ error: "Failed to update order status" });
    } finally {
      if (conn) await conn.close();
    }
  }
);

// DELETE /api/orders/:id - Delete order (admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    let conn;
    try {
      conn = await getConnection();
      
      const result = await conn.execute(
        `DELETE FROM ORDERS WHERE ORDER_ID = :id`,
        [req.params.id],
        { autoCommit: true }
      );
      
      if (result.rowsAffected === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json({ message: "Order deleted successfully" });
    } catch (err) {
      console.error("DELETE /orders/:id error:", err);
      res.status(500).json({ error: "Failed to delete order" });
    } finally {
      if (conn) await conn.close();
    }
  }
);


module.exports = router;