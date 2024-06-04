const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
const db = require("../db/db");
class DeviceLogController {
  async saveDeviceLog(req, res, next) {

    const values = Object.values(req.query).map(Number); // Перетворюємо значення параметрів у числа
    console.log('VALUES',values);
    let client;

    try {
    client = await db.connect(); 

const existRecord = await client.query(`select * from device_settings where device_code = ${values[0]}`)


console.log(values[0]);

if (existRecord.rows[0]) {
  console.log('EXIST',existRecord.rows);
  const query = `
  UPDATE device_settings 
  SET  display = $2,kupurnik = $3, monetnik = $4, bamk = $5, link_server = $6, water_type = $7, price1_1 = $8, price1_2 = $9, tara_calibrate1 = $10, tara_calibrate2 = $11, min_bak_1 = $12, max_bak_1 = $13, nosaleb1 = $14, min_bak_2 = $15, max_bak_2 = $16, nosaleb2 = $17, sensor_t_present1 = $18, sensor_t_min1 = $19, sensor_t_max1 = $20, sensor_t_present2 = $21, sensor_t_min2 = $22, sensor_t_max2 = $23, sensor_t_hand1 = $24, sensor_t_hand2 = $25, sensor_light_present = $26, sensor_light_on = $27, sensor_light_off = $28, sensor_light_hand_on_off = $29, sensor_power = $30, sensor_water_leaks = $31, sensor_water_in = $32, sensor_door_present = $33
  WHERE device_code = $1`
  await client.query("BEGIN"); // Початок транзакції
  await client.query(query, values);
  await client.query("COMMIT"); // Підтвердження транзакції
  res.status(201).send("Data saved successfully");
}else {
  const params = [];
  for (let i = 0; i <= 32; i++) {
    if (req.query[i] !== undefined) {
      params.push(req.query[i]);
    }
  }
  const query = `INSERT INTO device_settings 
  (device_code,display, kupurnik, monetnik, bamk, link_server, water_type, price1_1, price1_2, tara_calibrate1, tara_calibrate2, min_bak_1, max_bak_1, nosaleb1, min_bak_2, max_bak_2, nosaleb2, sensor_t_present1, sensor_t_min1, sensor_t_max1, sensor_t_present2, sensor_t_min2, sensor_t_max2, sensor_t_hand1, sensor_t_hand2, sensor_light_present, sensor_light_on, sensor_light_off, sensor_light_hand_on_off, sensor_power, sensor_water_leaks, sensor_water_in, sensor_door_present) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32,$33)`;
    await client.query("BEGIN"); // Початок транзакції
    await client.query(query, [...values]);
    await client.query("COMMIT"); // Підтвердження транзакції
    res.status(201).send("Data saved successfully");

}



  


    
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
      SELECT * FROM device_settings
      WHERE device_code= ${id}
      `);
      console.log(result.rows);
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

// struct Finanse{         //Какие деньги были внесены и в каком количестве (общее)
//   uint32_t Cash_5; 1
//   uint32_t Cash_10; 2
//   uint32_t Cash_20; 3
//   uint32_t Cash_50; 4
//   uint32_t Cash_100; 5
//   uint32_t Cash_200; 6
//   uint32_t Cash_500; 7
//   uint32_t Cash_1000; 8
//   uint32_t Coins_05; 9
//   uint32_t Coins_1; 10
//   uint32_t Coins_2; 11
//   uint32_t Coins_5; 12
//   uint32_t Coins_10; 13
// };

// ..finance/order?0=EWQ132131&1=20&10=30
