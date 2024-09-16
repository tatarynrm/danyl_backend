const db = require("../db/db");


const getColumns = async (tableName) => {
    const query = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = $1
    `;
    const result = await db.query(query, [tableName]);
    return result.rows.map(row => row.column_name);
  }

  module.exports = {
    getColumns
  }