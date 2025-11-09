// backend/config/db.js
const oracledb = require("oracledb");
require("dotenv").config();

// Always return query results as objects (not arrays)
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// ✅ Database configuration from environment variables
const dbConfig = {
  user: process.env.ORACLE_USER || "cloudkitchen",       // your schema user
  password: process.env.ORACLE_PASSWORD || "asif123",
  connectString: process.env.ORACLE_CONNECT_STRING || "localhost/cloudpdb", // your service name
};

// ✅ Connection Pool Configuration
const poolConfig = {
  user: dbConfig.user,
  password: dbConfig.password,
  connectString: dbConfig.connectString,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
  poolTimeout: 60,
};

let pool;

// ✅ Initialize Oracle connection pool
async function initialize() {
  try {
    console.log("🔄 Initializing Oracle connection pool...");
    pool = await oracledb.createPool(poolConfig);
    console.log("✅ Oracle connection pool created successfully");
    console.log(`📊 Connected to: ${dbConfig.connectString}`);
  } catch (err) {
    console.error("❌ Error creating connection pool:", err);
    throw err;
  }
}

// ✅ Get connection from pool
async function getConnection() {
  try {
    if (!pool) {
      throw new Error("Connection pool not initialized. Call initialize() first.");
    }
    const connection = await pool.getConnection();
    console.log("🔗 Database connection acquired");
    return connection;
  } catch (err) {
    console.error("🚨 Error getting connection from pool:", err);
    throw err;
  }
}

// ✅ Close the pool gracefully
async function close() {
  try {
    if (pool) {
      await pool.close(10);
      console.log("🔒 Connection pool closed");
    }
  } catch (err) {
    console.error("Error closing connection pool:", err);
  }
}

module.exports = { initialize, getConnection, close };
