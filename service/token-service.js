const jwt = require("jsonwebtoken");
const db = require("../db/db");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "10s",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30m",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccesToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const updatedDate = new Date()
    const tokenCount = await db.query(
      `select * from users_token where user_id = $1`,
      [userId]
    );
    
      if (tokenCount.rows.length > 0) {
        
        const updateQuery = `
          UPDATE users_token
          SET refresh_token = $1,updated_at = $2
          WHERE user_id = $3
        `;

        const values = [refreshToken,updatedDate, userId];
        const result = await db.query(updateQuery, values);
      
        return result.rows;
      }
      if (tokenCount.rows.length <= 0) {
        const queryString = `insert into users_token (user_id,refresh_token) values($1,$2)`;
        const values = [
          userId,
          refreshToken
        ];
        const result = await db.query(queryString, values);
        return result.rows;
      }

  }

  async removeToken(refreshToken) {
    const selectQuery = `
    delete from users_token where refresh_token = $1
    `;
    const values = [refreshToken];
    const tokenData = await db.query(selectQuery, values);
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await db.query(
      `select * from users_token where refresh_token = $1`,
      [refreshToken]
    );
  
    return tokenData;
  }
}

module.exports = new TokenService();
