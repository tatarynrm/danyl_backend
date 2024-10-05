const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const tokenService = require("../service/token-service");
const mailService = require("../service/mail-services");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const { mainAuthMethod } = require("../services/auth/main.method");
const { googleAuthMethod } = require("../services/auth/google.method");
class UserMessagesService {
  async getMessages(
    company_id

  ) {
    let client;


    try {
      client = await db.connect();
      const selectQuery = `
      SELECT * 
    FROM users_notifications
    WHERE company_id = $1
    ORDER BY created_at 
    LIMIT 50
      `;

      const values = [company_id];

      const result = await client.query(selectQuery, values);

    console.log('RESULT MESSAGES',company_id);
    console.log('RESULT MESSAGES',result.rows);
    
      

 if (result.rows) {
    return result.rows
 }
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle the error according to your application logic
    } finally {
      if (client) {
        client.release();
      }
    }
  }

}

module.exports = new UserMessagesService();
