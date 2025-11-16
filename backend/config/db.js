const oracledb = require("oracledb");
require("dotenv").config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
  user: process.env.ORACLE_USER || "cloudkitchen",
  password: process.env.ORACLE_PASSWORD || "asif123",
  connectString: process.env.ORACLE_CONNECT_STRING || "localhost/orclpdb",
};

const poolConfig = {
  user: dbConfig.user,
  password: dbConfig.password,
  connectString: dbConfig.connectString,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
  poolTimeout: 60,
};

let pool = null;

async function initialize() {
  try {
    console.log("Creating Oracle DB pool...");
    pool = await oracledb.createPool(poolConfig);
    console.log("Oracle pool created.");
  } catch (err) {
    console.error("DB Pool Error:", err.message);
    throw err;
  }
}

async function getConnection() {
  if (!pool) throw new Error("Pool not initialized. Call initialize() first.");
  return await pool.getConnection();
}

async function close() {
  try {
    if (pool) {
      await pool.close(5);
      console.log("Oracle pool closed.");
    }
  } catch (err) {
    console.error("Pool close error:", err.message);
  }
}

module.exports = { initialize, getConnection, close };