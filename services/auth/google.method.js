const db = require("../../db/db");
const UserDto = require("../../dtos/user-dto");
const tokenService = require("../../service/token-service");
const bcrypt = require('bcrypt')


const googleAuthMethod = async (email)=>{
try {
    const selectQuery = `
    SELECT * 
    FROM users 
    WHERE email = $1
  `;
   // Parameterized query values
   const values = [email];
   // Execute the query
   const user = await db.query(selectQuery, values);
   if (user.rows <= 0) {
     return {
       message: "Такої електронної адреси або паролю не знайдено",
       error: "User incorect",
       status: 401,
     };
   }
   const userData = user.rows[0];


   const userDto = new UserDto(userData);

   const tokens = tokenService.generateTokens({ ...userDto });
   const tokensServiceData = await tokenService.saveToken(
     userDto.id,
     tokens.refreshToken
   );
   // console.log('TOKENSERVICEDATA',tokensServiceData);

   if (tokensServiceData >= 5) {
     return {
       message: `Більше 5-ти аккаунтів у користуванні\nВийдіть з поточних аккаунтів для користування сервісом`,
     };
   } else {
     return {
       ...tokens,
       user: userDto,
     };
    }
} catch (error) {
    console.log(error);
  
}
}


module.exports = {
    googleAuthMethod
}