const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
const db = require("../db/db");

class StatisticController {
  async liters(req, res, next) {
   const {company_id} = req.body
    let client;

    try {
      client = await db.connect();

      const result = await client.query(`
  SELECT d.code, d.company_id, r.liters_count, r.water_type
FROM device d
JOIN report_out_water r ON d.code = r.device_code
WHERE d.company_id = $1;
      `, [company_id]);
        console.log(company_id);
        
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error executing SQL query:", error);
    } finally {
      if (client) {
        client.release(); // Release the client back to the pool
      }
    }
  }
  async incomeMoney(req, res, next) {
   const {company_id} = req.body
    let client;

    try {
      client = await db.connect();

      const result = await client.query(`
    SELECT 
      r.device_code,
      SUM(r.liters_count * dwp.price) AS total_earned
    FROM 
      report_out_water r
    JOIN 
      device_water_price dwp ON r.device_code = dwp.device_code
    JOIN 
      device d ON r.device_code = d.code
    WHERE 
      d.company_id = $1
    GROUP BY 
      r.device_code;
      `, [company_id]);
        
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error executing SQL query:", error);
    } finally {
      if (client) {
        client.release(); // Release the client back to the pool
      }
    }
  }





}

module.exports = new StatisticController();
