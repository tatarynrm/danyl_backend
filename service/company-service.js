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
const { getColumns } = require("../helpers/getDBcolumns");
class CompanyService {
  async registration(
    type,company_name,director_name,director_surname,director_last_name,company_code,legal_address,phone_number
  ) {
    let client;
    const defaultUserRole = "user";
    const defaultActivatedUser = false;
    try {
      client = await db.connect();
      const selectQuery = `
        SELECT * 
        FROM company 
        WHERE company_code = $1
      `;

      const values = [company_code];

      const result = await client.query(selectQuery, values);

      if (result.rows.length > 0) {
        console.log(result.rows);
        console.log("Company with this code already exists");

        return {
          message: "Company is already exist",
          error: "compayExist",
          status: 409
        };
      } else {
    
        const selectQuery = `
        insert into company (type,company_name,director_name,director_surname,director_last_name,company_code,legal_address,phone_number) values ($1,$2,$3,$4,$5,$6,$7,$8) returning *
        `;

        const values = [type,company_name,director_name,director_surname,director_last_name,company_code,legal_address,phone_number];
        const result = await db.query(selectQuery, values);




        return {
          result,

        };
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

  async login(email, password, method) {
    console.log('^^^^^^^^^^^^^^^^^^', email, password, method);
    try {
      switch (method) {
        case undefined:
          // Handle main authentication method (email/password)
         return await mainAuthMethod(email, password);
          // Handle successful login or error response
          break;
  
        case 'GOOGLE':
          // Handle Google OAuth authentication
          return   await googleAuthMethod(email);
          // Handle successful login or error response
          break;
  
        default:
          // Handle unsupported or unknown methods
          console.log('Unsupported authentication method');
          throw new Error('Unsupported authentication method');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error; // Re-throw the error for upper layers to handle
    }
  }
  async validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken || refreshToken === null) {
      return {
        message: "Виникла якась помилка",
        error: "Invalid token",
      };
    }
    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      return {
        message: "User doesnt exist",
        error: "userDoesntExist",
      };
    }

    const user = await db.query(
      `select a.*,b.name,b.surname,b.lastname,b.phone_number,b.role_id from users a 
      left join users_info b on a.id = b.user_id
    
      where a.id = $1`,
      [userData.id]
    );
    // const user = await db.query(
    //   `select * from users
    //   where id = $1`,[userData.id]
    // );
    const userDto = new UserDto(user?.rows[0]);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto, userInfo: user?.rows[0] };
  }

  async getAllCompanies() {
    const result = await db.query(`
    select * from company
    `);
    return result.rows;
  }



  async  searchCompanies(value) {
    if (!value) {
      throw new Error('Search value must be provided');
    }
  
    try {
      // Отримуємо текстові стовпці, виключаючи стовпець 'id'
      const textColumnsResult = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'company' 
          AND column_name <> 'id'
          AND data_type IN ('character varying', 'character', 'text')
      `);
  
      const textColumns = textColumnsResult.rows.map(row => row.column_name);
  
      if (textColumns.length === 0) {
        throw new Error('No text columns found for searching');
      }
  
      // Створюємо частину запиту для WHERE умови
      const conditions = textColumns.map((col, index) => `${col} ILIKE $${index + 1}`).join(' OR ');
  
      // Створюємо параметри запиту
      const queryParams = new Array(textColumns.length).fill(`%${value}%`);
  
      // Будуємо запит
      const query = `
        SELECT * FROM company
        WHERE ${conditions}
      `;
  
      // Виконуємо запит до бази даних
      const result = await db.query(query, queryParams);
  
      return result.rows; // Повертає рядки з результатами запиту
  
    } catch (error) {
      console.error('Error executing query', error.stack);
      throw error; // Кидаємо помилку для обробки вищими рівнями
    }
  }



  async getCompanyType() {
    const result = await db.query(`
    select * from company_type
    `);
    return result.rows;
  }
  async getOneUserByEmail(email) {
    const selectQuery = `
    select a.*,b.name,b.surname,b.lastname,b.phone_number,c.role
    from users a
    left join users_info b on a.id = b.user_id
    left join users_access c on b.role_id = c.id
    where a.email LIKE $1
  `;
    const values = [`%${email}%`];
    const users = await db.query(selectQuery, values);
    return users.rows;
  }
}

module.exports = new CompanyService();
