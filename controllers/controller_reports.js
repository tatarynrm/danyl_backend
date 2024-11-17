const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
const db = require("../db/db");

class ControllerReportsControler {

//   ACTIVE
    // Зберігаємо скільки було внесено грошей 
  async saveMoneyInserted(req, res, next) {
    const values = Object.values(req.query).map(Number); // Convert query parameters to numbers
    let client;


    try {
      client = await db.connect();

      // You cannot use a WHERE clause in an INSERT. Assuming you're trying to insert a nominal value
      const query = `
        INSERT INTO report_money_insert (device_code, nominal,type_list_money_insert) 
        VALUES ($1, $2,$3)
      `;

      await client.query("BEGIN"); // Begin transaction
      await client.query(query, [values[0], values[1],values[2]]); // Use values properly
      await client.query("COMMIT"); // Commit the transaction
      res.status(201).send("1");
    } catch (error) {
      console.error("Error executing SQL query:", error);
      if (client) {
        await client.query("ROLLBACK"); // Rollback the transaction in case of error
      }
      next(error); // Pass the error to the next handler
    } finally {
      if (client) {
        client.release(); // Release the client back to the pool
      }
    }
  }


    // Зберігаємо скільки було видано води клієнту
  async saveLitersOutInserted(req, res, next) {
    const values = Object.values(req.query).map(Number); // Convert query parameters to numbers
    let client;
    try {
      client = await db.connect();

      // You cannot use a WHERE clause in an INSERT. Assuming you're trying to insert a nominal value
      const query = `
        INSERT INTO report_out_water (device_code, water_type,liters_count) 
        VALUES ($1, $2,$3)
      `;

      await client.query("BEGIN"); // Begin transaction
      await client.query(query, [values[0], values[1],values[2]]); // Use values properly
      await client.query("COMMIT"); // Commit the transaction
      res.status(201).send("1");
    } catch (error) {
      console.error("Error executing SQL query:", error);
      if (client) {
        await client.query("ROLLBACK"); // Rollback the transaction in case of error
      }
      next(error); // Pass the error to the next handler
    } finally {
      if (client) {
        client.release(); // Release the client back to the pool
      }
    }
  }



//   IN PROGRESS
  // Зберігаємо скільки було внесено купюр в апарат
  async saveCashInserted(req, res, next) {
    const values = Object.values(req.query).map(Number); // Convert query parameters to numbers
    let client;
    console.log(values);

    try {
      client = await db.connect();

      // You cannot use a WHERE clause in an INSERT. Assuming you're trying to insert a nominal value
      const query = `
        INSERT INTO report_money_cash_inserted (device_code, nominal) 
        VALUES ($1, $2)
      `;

      await client.query("BEGIN"); // Begin transaction
      await client.query(query, [values[0], values[1]]); // Use values properly
      await client.query("COMMIT"); // Commit the transaction
      res.status(201).send("1");
    } catch (error) {
      console.error("Error executing SQL query:", error);
      if (client) {
        await client.query("ROLLBACK"); // Rollback the transaction in case of error
      }
      next(error); // Pass the error to the next handler
    } finally {
      if (client) {
        client.release(); // Release the client back to the pool
      }
    }
  }
    // Зберігаємо скільки було внесено монет в апарат
  async saveCoinsInserted(req, res, next) {
    const values = Object.values(req.query).map(Number); // Convert query parameters to numbers
    let client;
    console.log(values);

    try {
      client = await db.connect();

      // You cannot use a WHERE clause in an INSERT. Assuming you're trying to insert a nominal value
      const query = `
        INSERT INTO report_coins_cash_inserted (device_code, nominal) 
        VALUES ($1, $2)
      `;

      await client.query("BEGIN"); // Begin transaction
      await client.query(query, [values[0], values[1]]); // Use values properly
      await client.query("COMMIT"); // Commit the transaction
      res.status(201).send("1");
    } catch (error) {
      console.error("Error executing SQL query:", error);
      if (client) {
        await client.query("ROLLBACK"); // Rollback the transaction in case of error
      }
      next(error); // Pass the error to the next handler
    } finally {
      if (client) {
        client.release(); // Release the client back to the pool
      }
    }
  }
    // Зберігаємо скільки було внесено грошей через paypass
  async savePaypassInserted(req, res, next) {
    const values = Object.values(req.query).map(Number); // Convert query parameters to numbers
    let client;


    try {
      client = await db.connect();

      // You cannot use a WHERE clause in an INSERT. Assuming you're trying to insert a nominal value
      const query = `
        INSERT INTO report_paypass_cash_inserted (device_code, nominal) 
        VALUES ($1, $2)
      `;

      await client.query("BEGIN"); // Begin transaction
      await client.query(query, [values[0], values[1]]); // Use values properly
      await client.query("COMMIT"); // Commit the transaction
      res.status(201).send("1");
    } catch (error) {
      console.error("Error executing SQL query:", error);
      if (client) {
        await client.query("ROLLBACK"); // Rollback the transaction in case of error
      }
      next(error); // Pass the error to the next handler
    } finally {
      if (client) {
        client.release(); // Release the client back to the pool
      }
    }
  }

}

module.exports = new ControllerReportsControler();
