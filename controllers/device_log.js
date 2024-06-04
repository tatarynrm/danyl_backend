const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
const db = require("../db/db");
class DeviceLogController {
  async saveDeviceLog(req, res, next) {
    // const { device_id, code, value } = req.query;
console.log(req.query);
    // const query =
    //   "INSERT INTO device_log (device_id, code, value) VALUES ($1, $2, $3)";
    // const values = [device_id, code, value];

    let client;

    try {
      client = await db.connect();

      // await client.query("BEGIN"); // Початок транзакції
      // await client.query(query, values);
      // await client.query("COMMIT"); // Підтвердження транзакції

      res.status(201).send("Data saved successfully");
    } catch (error) {
      console.error("Error executing SQL query:", error);
      throw error; // Перенаправляємо помилку далі для обробки вище
    } finally {
      if (client) {
        client.release();
      }
    }
  }
  // async saveDeviceLog(req, res, next) {
  //   const { device_id, code, value } = req.query;

  //   const query =
  //     "INSERT INTO device_log (device_id, code, value) VALUES ($1, $2, $3)";
  //   const values = [device_id, code, value];

  //   let client;

  //   try {
  //     client = await db.connect();

  //     await client.query("BEGIN"); // Початок транзакції
  //     await client.query(query, values);
  //     await client.query("COMMIT"); // Підтвердження транзакції

  //     res.status(201).send("Data saved successfully");
  //   } catch (error) {
  //     console.error("Error executing SQL query:", error);
  //     throw error; // Перенаправляємо помилку далі для обробки вище
  //   } finally {
  //     if (client) {
  //       client.release();
  //     }
  //   }
  // }
  async getOneDeviceLog(req, res, next) {
    const { id } = req.params;
console.log(id);
    let client;
    try {
      client = await db.connect();
      const result = await client.query(`
      SELECT * FROM device_log
      WHERE device_id = ${id}
      ORDER BY created_at DESC
      LIMIT 50

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
module.exports = new DeviceLogController();
