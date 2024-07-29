const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
const db = require("../db/db");
class AdminController {
  async selectRefundDevice(req, res, next) {
    let client;
    
    const values = Object.values(req.query).map(Number); // Перетворюємо значення параметрів у числа
    console.log('VALUES', values);
    console.log(values);
    try {
      client = await db.connect();
      const result = await client.query(`
     select * from admin_refund_water where device_code = ${values[0]} and date_confirm is null
      `);

      res.status(200).send(result.rows[0].water_count)
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
module.exports = new AdminController();
