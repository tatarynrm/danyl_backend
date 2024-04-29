const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
const db = require("../db/db");
class DeviceController {
  async getDevices(req, res, next) {
    let client;
    try {
      client = await db.connect();
      const result = await client.query(`
      SELECT 
      a.*,
      a.id,
      b.title AS model_title,
      e.language,
      f.title as model,
      CASE WHEN b.product_list = true THEN agg_array_table.product_list_array ELSE NULL END AS product_list
  FROM 
      device a
  LEFT JOIN 
      device_model b ON a.model_code = b.id
  LEFT JOIN 
      device_language e ON a.language_code = e.id
  LEFT JOIN 
      device_model f ON a.model_code = f.id
  LEFT JOIN LATERAL (
      SELECT ARRAY_AGG(jsonb_build_object('title', title, 'code', code)) AS product_list_array
      FROM product_list
  ) AS agg_array_table ON b.product_list = true;

      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Error executing SQL query:", error);
      throw error; // Перенаправляємо помилку далі для обробки вище
    } finally {
      if (client) {
        client.release();
      }
    }
  }
  async getOneDevice(req, res, next) {
    const { id } = req.params;
    console.log(id);
    let client;
    try {
      client = await db.connect();
      const result = await client.query(`
      SELECT 
      a.*,
      a.id,
      b.title AS model_title,
      e.language,
      f.title as model,
      CASE WHEN b.product_list = true THEN agg_array_table.product_list_array ELSE NULL END AS product_list
  FROM 
      device a
  LEFT JOIN 
      device_model b ON a.model_code = b.id
  LEFT JOIN 
      device_language e ON a.language_code = e.id
  LEFT JOIN 
      device_model f ON a.model_code = f.id
  LEFT JOIN LATERAL (
      SELECT ARRAY_AGG(jsonb_build_object('title', title, 'code', code)) AS product_list_array
      FROM product_list
  ) AS agg_array_table ON b.product_list = true
  WHERE a.code = ${id}

      `);
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error executing SQL query:", error);
      throw error; // Перенаправляємо помилку далі для обробки вище
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async getOneDeviceState(req, res, next) {
    const { id } = req.params;
    let client;
    try {
      client = await db.connect();
      const result = await client.query(`
      SELECT a.id, a.water_state as water, a.money_state as money,a.created_at,a.device_code
      FROM device_state a
      WHERE device_code = ${id} 
      ORDER BY created_at DESC
      LIMIT 20
      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Error executing SQL query:", error);
      throw error; // Перенаправляємо помилку далі для обробки вище
    } finally {
      if (client) {
        client.release();
      }
    }
  }
}
module.exports = new DeviceController();
