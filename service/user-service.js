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
class UserService {
  async registration(
    email,
    password,
    name,
    surname,
    lastname,
    phone_number,
    role_id,
    company_id
  ) {
    let client;
    const defaultUserRole = "user";
    const defaultActivatedUser = false;
    try {
      client = await db.connect();
      const selectQuery = `
        SELECT * 
        FROM users 
        WHERE email = $1
      `;

      const values = [email];

      const result = await client.query(selectQuery, values);
      if (
        !email ||
        !password ||
        !name ||
        !surname ||
        !lastname ||
        !phone_number ||
        !role_id ||
        !company_id
      ) {
        return {
          message: "INCORECT DATA",
        };
      }
      if (result.rows.length > 0) {
        console.log(result.rows);
        console.log("User with this email already exists");

        return {
          message: "User is already exist",
          error: "userExist",
          status: 409
        };
      } else {
        console.log("Email is available for registration");
        const passwordHash = await bcrypt.hash(password, 3);
        const selectQuery = `
        insert into users (email,pwd_hash) values ($1,$2) returning *
        `;

        const values = [email, passwordHash];
        // const result = await db.query(selectQuery, values);
        const result = await client.query('SELECT * FROM insert_user($1, $2)', values);
        const user = result?.rows[0];
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        if (user.id) {
          const selectQuery = `
        insert into users_info (name,surname,lastname,phone_number,user_id,role_id,company_id)
        values($1,$2,$3,$4,$5,$6,$7) returning *
      `;

          const values = [
            name,
            surname,
            lastname,
            phone_number,
            user.id,
            parseInt(role_id),
            parseInt(company_id),
          ];

          const result = await client.query(selectQuery, values);
          // const result = await client.query('SELECT * FROM users_info($1, $2, $3, $4, $5, $6,$7)', values);
          console.log(result);
        }
        // return {
        //   ...tokens,
        //   user: userDto,
        // };
        return {
          user,

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
      `select a.*,b.name,b.surname,b.lastname,b.phone_number,b.role_id,b.company_id from users a 
      left join users_info b on a.id = b.user_id
    
      where a.id = $1`,
      [userData.id]
    );



    

    
    const userDto = new UserDto(user?.rows[0]);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto, userInfo: user?.rows[0] };
  }

  async getAllUsers() {
    const users = await db.query(`
    select a.*,b.name,b.surname,b.lastname,b.phone_number,c.role
    from users a
    left join users_info b on a.id = b.user_id
    left join users_access c on b.role_id = c.id
    `);
    return users.rows;
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

module.exports = new UserService();
