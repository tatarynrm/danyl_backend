const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
const db = require("../db/db");
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.ADMIN_BOT_TOKEN)
class DeviceController {
  async getDevices(req, res, next) {
    const { company_id } = req.body;
    console.log(company_id);
  
    let client;
    try {
      client = await db.connect();
      const result = await client.query(
        `
        SELECT 
          a.*,
          a.id,
          b.title AS model_title,
          e.language,
          f.title AS model,
          CASE 
            WHEN b.product_list = true THEN agg_array_table.product_list_array 
            ELSE NULL 
          END AS product_list
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
        WHERE a.company_id = $1
        `,
        [company_id] // Использование параметра для защиты от SQL-инъекций
      );
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      if (client) client.release();
    }
  }
  async getOneDevice(req, res, next) {
    const { id } = req.params;
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
      console.log('es',result.rows[0]);
      
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

      console.log('dsadsa',result.rows);
      
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




  // Створити апарат 




  // Опції

  async  createDevice(req, res, next) {
    let client;
    try {
      client = await db.connect();
  
      // Отримання даних з тіла запиту
      const { comunication_type, device_coin_model, device_cupure_model,device_display_model,device_model,device_paypass_model,phone_number,service_phone_number } = req.body;
  

   
  
      // Виконання SQL-запиту на вставку нового пристрою
      const insertQuery = `
        INSERT INTO device (comunication_code,coin_code, banknote_code,display_code,model_code,paypass_code,phone_number,service_phone_number)
        VALUES ($1, $2, $3,$4,$5,$6,$7,$8) RETURNING *;
      `;
      const values = [comunication_type, device_coin_model, device_cupure_model,device_display_model,device_model,device_paypass_model,phone_number,service_phone_number ];
      
      const result = await client.query(insertQuery, values);
      
      // Отримання створеного пристрою
      const newDevice = result.rows[0];

      const telegramAdmin = await client.query(`select * from telegram_admins`);
      const telegramIdList = telegramAdmin.rows

  for (let i = 0; i < telegramIdList.length; i++) {
    const element = telegramIdList[i];
    bot.telegram.sendMessage(element.tg_id,`Щойно було створено апарат № ${newDevice.code}`)
  }
   
      
      // Відправка відповіді клієнту
      res.status(201).json({
        message: 'Device created successfully',
        device: newDevice,
      });
    } catch (error) {
      console.error('Error executing query', error.stack);
      next(error); // Передача помилки далі в middleware обробки помилок
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async  getDeviceParams(req,res,next) {

    
    let client;
    try {
      client = await db.connect();
  
      // Виконуємо обидва запити паралельно
      const [devicesResult, deviceModelsResult,deviceComunicationType,deviceCupureModel,deviceCoinModel,devicePaypassModel,deviceDisplayModel,gsmComunicationType] = await Promise.all([
        client.query('SELECT * from device_model'),
        client.query('SELECT * FROM device_language'),
        client.query('SELECT * FROM device_comunication_type'),
        client.query('SELECT * FROM device_cupure_model'),
        client.query('SELECT * FROM device_coin_model'),
        client.query('SELECT * FROM device_paypass_model'),
        client.query('SELECT * FROM device_display_model'),
        client.query('SELECT * FROM device_display_model'),
      ]);
  
      // Отримуємо результати
      const device_model = devicesResult.rows;
      const device_language = deviceModelsResult.rows;
      const device_comunication_type = deviceComunicationType.rows;
      const device_cupure_model = deviceCupureModel.rows;
      const device_coin_model = deviceCoinModel.rows;
      const device_paypass_model = devicePaypassModel.rows;
      const device_display_model = deviceDisplayModel.rows;




       res.json({
        device_model,
        device_language,
        device_comunication_type,
        device_cupure_model,
        device_coin_model,
        device_paypass_model,
        device_display_model
       })
   
  
    } catch (error) {
      console.error('Error executing query', error.stack);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }



  async changeDeviceLocation (req,res,next) {

    const {location,lat,lon,code} = req.body


    console.log(req.body);
    
    let client;

    try {
        // Connect to the database
        client = await db.connect();
        console.log('Connected to the database.');

        // Update query
        const query = 'UPDATE device SET location = $1, lat = $2 ,lon =$3 WHERE code = $4';
        const values = [location, lat, lon,code];

        // Execute the update query
        const result = await client.query(query, values);
        console.log(`Updated ${result.rowCount} row(s).`);
        if (result.rowCount) {
          res.json({
            status:200,
            
          })
        }
    } catch (error) {
        console.error('Error executing update query', error.stack);
    } finally {
        // Release the client back to the pool
        if (client) {
            client.release();
            console.log('Client released back to pool.');
        }
    }
  } 


  async  getAllDevicesCompany(req,res,next) {
const {company_id} = req.body
console.log('company_id',req.body);

    
    let client;
    try {
      client = await db.connect();




const result = await client.query(`select * from device where company_id =${+company_id}`)
       res.json(result.rows)
   
  
    } catch (error) {
      console.error('Error executing query', error.stack);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }


  // Команди Адміністратора
  async  getAllDevicesAdmin(req,res,next) {

    
    let client;
    try {
      client = await db.connect();




const result = await client.query(`select * from device`)
       res.json(result.rows)
   
  
    } catch (error) {
      console.error('Error executing query', error.stack);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }



}
module.exports = new DeviceController();
