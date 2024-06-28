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

const existRecord = await client.query(`select * from controller_settings where device_id = ${values[0]}`)




if (existRecord.rows[0]) {
  console.log('EXIST',existRecord.rows);
  const query = `
  UPDATE controller_settings
SET
  display = $2,
  kupurnik = $3,
  monetnik = $4,
  bank = $5,
  link_server = $6,
  water_type = $7,
  price_1 = $8,
  price_2 = $9,
  min_bak = $10,
  max_bak = $11,
  nosale = $12,
  sensor_present1 = $13,
  sensor_t_min_1 = $14,
  sensor_t_max_1 = $15,
  sensor_t_present_2 = $16,
  sensor_t_min_2 = $17,
  sensor_t_max_2 = $18,
  sensor_t_hand_1 = $19,
  sensor_t_hand_2 = $20,
  sensor_light_present = $21,
  sensor_light_on = $22,
  sensor_light_off = $23,
  sensor_light_on_off = $24,
  sensor_power = $25,
  sensor_water_leaks = $26,
  sensor_water_in = $27,
  sensor_door_present = $28,
  impulse_per_litr1 = $29,
  impulse_per_litr2 = $30,
  sensor_humidity_present = $31,
  sensor_humidity_on = $32,
  sensor_humidity_off = $33,
  timeout_reset_mode = $34,
  banknote_multiplayer = $35,
  coins_multiplayer = $36,
  sale_mode = $37
WHERE device_id = $1;`
  await client.query("BEGIN"); // Початок транзакції
  await client.query(query, values);
  await client.query("COMMIT"); // Підтвердження транзакції
  res.status(201).send("Data update successfully");
}else {
  const params = [];
  for (let i = 0; i <= 40; i++) {
    if (req.query[i] !== undefined) {
      params.push(req.query[i]);
    }
  }
const query = `
INSERT INTO controller_settings 
  (device_id, display, kupurnik, monetnik, bank, link_server, water_type, price_1, price_2, min_bak, max_bak, nosale, sensor_present1, sensor_t_min_1, sensor_t_max_1, sensor_t_present_2, sensor_t_min_2, sensor_t_max_2, sensor_t_hand_1, sensor_t_hand_2, sensor_light_present, sensor_light_on, sensor_light_off, sensor_light_on_off, sensor_power, sensor_water_leaks, sensor_water_in, sensor_door_present, impulse_per_litr1, impulse_per_litr2, sensor_humidity_present, sensor_humidity_on, sensor_humidity_off, timeout_reset_mode, banknote_multiplayer, coins_multiplayer, sale_mode)
VALUES 
  ($1,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37);

`
  
  // const query = `INSERT INTO controller_settings 
  // (device_id) 
  // VALUES ($1)`;
    
  
  
    await client.query("BEGIN"); // Початок транзакції
    await client.query(query, [...values]);
    // await client.query(query, [values[0]]);
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
   
    let client;
    try {
      client = await db.connect();
      const result = await client.query(`
      SELECT * FROM controller_settings
      WHERE device_id= ${id}
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


