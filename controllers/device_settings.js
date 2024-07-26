const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
const db = require("../db/db");
class DeviceLogController {
  async saveDeviceLog(req, res, next) {
    const values = Object.values(req.query).map(Number); // Перетворюємо значення параметрів у числа
    console.log('VALUES', values);
    let client;

    try {
      client = await db.connect();

      const existRecord = await client.query(`select * from controller_settings where device_id = ${values[0]}`)

      if (existRecord.rows[0]) {
        console.log('EXIST', existRecord.rows);
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
      } else {
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

  async getOneDeviceLog(req, res, next) {
    const { id } = req.params;

    let client;
    try {
      client = await db.connect();
      const result = await client.query(`
      SELECT * FROM controller_settings
      WHERE device_id= ${id}
      `);
console.log(result.rows[0]);

if (result.rows.length > 0) {
  const data =  result.rows[0]
return  res.send(`0=${data.device_id}&1=${data.display}&2=${data.kupurnik}&3=${data.monetnik}&4=${data.bank}&5=${data.link_server}&6=${data.water_type}&7=${data.price_1}&8=${data.price_2}&9=${data.min_bak}&10=${data.max_bak}&11=${data.nosale}&12=${data.sensor_present1}&13=${data.sensor_t_min_1}&14=${data.sensor_t_max_1}&15=${data.sensor_t_present_2}&16=${data.sensor_t_min_2}&17=${data.sensor_t_max_2}&18=${data.sensor_t_hand_1}&19=${data.sensor_t_hand_2}&20=${data.sensor_light_present}&21=${data.sensor_light_on}&22=${data.sensor_light_off}&23=${data.sensor_light_on_off}&24=${data.sensor_power}&25=${data.sensor_water_leaks}&26=${data.sensor_water_in}&27=${data.sensor_door_present}&28=${data.impulse_per_litr1}&29=${data.impulse_per_litr2}&30=${data.sensor_humidity_present}&31=${data.sensor_humidity_on}&32=${data.sensor_humidity_off}&33=${data.timeout_reset_mode}&34=${data.banknote_multiplayer}&35=${data.coins_multiplayer}&36=${data.sale_mode}`)
}else {
 return res.send('0');
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


  async saveMainfinrep(req, res, next) {

    const values = Object.values(req.query).map(Number); // Перетворюємо значення параметрів у числа
    console.log('VALUES', values);
    let client;
    try {
      client = await db.connect();
      const existRecord = await client.query(`select * from controller_mainfinrep where device_code = ${values[0]}`)
      if (existRecord.rows[0]) {
        const query = `
  UPDATE controller_mainfinrep
SET
cash_5 = $2,cash_10 = $3,cash_20=$4,cash_50=$5,cash_100=$6,cash_200=$7,cash_500=$8,cash_1000=$9,coins_05=$10,coins_1=$11,coins_2=$12,coins_5=$13,coins_10=$14
WHERE device_code = $1;`
        await client.query("BEGIN"); // Початок транзакції
        await client.query(query, values);
        await client.query("COMMIT"); // Підтвердження транзакції
        res.status(201).send("1");
      } else {
        const params = [];
        for (let i = 0; i <= 40; i++) {
          if (req.query[i] !== undefined) {
            params.push(req.query[i]);
          }
        }
        const query = `
INSERT INTO controller_mainfinrep
  (device_code,cash_5,cash_10,cash_20,cash_50,cash_100,cash_200,cash_500,cash_1000,coins_05,coins_1,coins_2,coins_5,coins_10)
VALUES 
  ($1,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);

`
        await client.query("BEGIN"); // Початок транзакції
        await client.query(query, [...values]);
        // await client.query(query, [values[0]]);
        await client.query("COMMIT"); // Підтвердження транзакції
        res.status(201).send("1");

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
  async saveMainService(req, res, next) {

    const values = Object.values(req.query).map(String); // Перетворюємо значення параметрів у числа
    console.log('VALUES', values);
    let client;

console.log(values.length);

    try {
      client = await db.connect();



        // console.log(params);
        const query = `
INSERT INTO controller_mainservice
  (device_code,pred_filter,post_filter,membrana,lamp)
VALUES 
  ($1,$2, $3, $4, $5);

`
if (values.length === 5 ) {
  await client.query("BEGIN"); // Початок транзакції
  await client.query(query, [...values]);
  // await client.query(query, [values[0]]);
  await client.query("COMMIT"); // Підтвердження транзакції
  res.status(201).send("1");
}else {
  res.status(201).send("0");
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


  async saveMainwr(req, res, next) {

    const values = Object.values(req.query).map(Number); // Перетворюємо значення параметрів у числа
    console.log('VALUES', values);
    let client;

    try {
      client = await db.connect();

      const existRecord = await client.query(`select * from controller_mainwr where device_code = ${values[0]}`)




      if (existRecord.rows[0]) {
        console.log('EXIST', existRecord.rows);
        const query = `
  UPDATE controller_mainwr
SET
sold_water = $2,
water_left = $3,
sold_water2 = $4,
water_left2 = $5 
WHERE device_code = $1;`
        await client.query("BEGIN"); // Початок транзакції
        await client.query(query, values);
        await client.query("COMMIT"); // Підтвердження транзакції
        res.status(201).send("1");
      } else {
        const params = [];
        for (let i = 0; i <= 40; i++) {
          if (req.query[i] !== undefined) {
            params.push(req.query[i]);
          }
        }
        const query = `
INSERT INTO controller_mainwr
  (device_code,sold_water,water_left,sold_water2,water_left2 )
VALUES 
  ($1,$2, $3, $4, $5);

`




        await client.query("BEGIN"); // Початок транзакції
        await client.query(query, [...values]);
        // await client.query(query, [values[0]]);
        await client.query("COMMIT"); // Підтвердження транзакції
        res.status(201).send("1");

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
  async saveMainreport(req, res, next) {

    const values = Object.values(req.query).map(Number); // Перетворюємо значення параметрів у числа
    console.log('VALUES', values);
    let client;

    try {
      client = await db.connect();

      const existRecord = await client.query(`select * from controller_mainreport where device_code= ${values[0]}`)




      if (existRecord.rows[0]) {
        console.log('EXIST', existRecord.rows);
        const query = `
  UPDATE controller_mainreport
SET
  reload_period = $2

WHERE device_code = $1;`
        await client.query("BEGIN"); // Початок транзакції
        await client.query(query, values);
        await client.query("COMMIT"); // Підтвердження транзакції
        res.status(201).send("Data update successfully");
      } else {
        const params = [];
        for (let i = 0; i <= 40; i++) {
          if (req.query[i] !== undefined) {
            params.push(req.query[i]);
          }
        }
        const query = `
INSERT INTO controller_mainreport 
  (device_code, reload_period)
VALUES 
  ($1,$2);

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
  async saveAllLogs(req, res, next) {

    const values = Object.values(req.query).map(String); // Перетворюємо значення параметрів у числа

    let client;

    const code = values[0]

    const newValues = values.slice(1,10)

    const settings_list  = values[1].split(' ')


console.log('!@#@!#@!',values.slice(1,10));
    // console.log('!@#@!#@!',values);
    try {
      client = await db.connect();
      if (settings_list.length === 2) {
        console.log('LENGTH = 1');
    
        const query = `
INSERT INTO controller_logs
  (device_code,log_date,log_code,log_value)
VALUES 
  ($1,$2,$3,$4);
`
        await client.query("BEGIN"); // Початок транзакції
        await client.query(query, [code,...newValues]);
        // await client.query(query, [values[0]]);
        await client.query("COMMIT"); // Підтвердження транзакції
        res.status(201).send("1");
      }else {
        const query = `
        INSERT INTO controller_logs
          (device_code, log_date,log_code)
        VALUES 
          ($1,$2,$3);
        
        `
                await client.query("BEGIN"); // Початок транзакції
                await client.query(query, [code,newValues[0],newValues[1]]);
                // await client.query(query, [values[0]]);
                await client.query("COMMIT"); // Підтвердження транзакції
                res.status(201).send("1");
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
}


module.exports = new DeviceLogController();


