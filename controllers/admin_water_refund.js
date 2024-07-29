const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
const moment = require('moment-timezone');
const db = require("../db/db");
class AdminController {
  async selectRefundDevice(req, res, next) {
    let client;
    
    const values = Object.values(req.query).map(Number); // Перетворюємо значення параметрів у числа
    console.log('VALUES', values);
    try {
      client = await db.connect();
      const result = await client.query(`
     select * from admin_refund_water where device_code = ${values[0]} and date_confirm is null
      `);

      res.status(200).send(`${result.rows[0].water_count}`)
    } catch (error) {
      console.error("Error executing SQL query:", error);
      throw error; // Перенаправляємо помилку далі для обробки вище
    } finally {
      if (client) {
        client.release();
      }
    }
  }
  async doneRefundDevice(req, res, next) {
    let client;
    const timestampWithTimeZone = moment().tz('Europe/Kyiv').format();
    const values = Object.values(req.query).map(Number); // Перетворюємо значення параметрів у числа
   
   console.log('VALUES ENTRIES',values);
    try {
      client = await db.connect();
      const result = await client.query(`
     select * from admin_refund_water where device_code = ${values[0]} and water_count = ${+values[1]} 
      `);
console.log('COUNT WATER ADD',result.rows);
if (result.rows[0]) {
 
  const query = `
UPDATE admin_refund_water
SET
status = 1,water_count = $2,date_confirm = $3

WHERE device_code = $1`
  await client.query("BEGIN"); // Початок транзакції
  await client.query(query, [values[0], values[1],timestampWithTimeZone]);
  await client.query("COMMIT"); // Підтвердження транзакції
  res.status(200).send("1");
}
      // res.status(200).send(result.rows[0].water_count)
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
