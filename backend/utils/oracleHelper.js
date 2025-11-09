// backend/utils/oracleHelper.js
function mapResult(result) {
  if (!result || !result.rows) return [];
  return result.rows.map((row) => {
    const obj = {};
    for (const key in row) {
      obj[key] = row[key];
    }
    return obj;
  });
}

module.exports = { mapResult };
