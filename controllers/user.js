const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
class UserController {
  async registration(req, res, next) {
    try {
      const { email, password,platform,browser,device_id,name,surname,lastname,phone_number,role_id,company_id } = req.body;
      // const userData = await userService.registration(email, password,platform,browser,device_id);
      const userData = await userService.registration(email, password,name,surname,lastname,phone_number,role_id,company_id);
      // res.cookie("refreshToken", userData.refreshToken, {
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   httpOnly: true,
      // });
      console.log('this is userDATA from registration controller',userData);
      return res.json(userData);
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
  async login(req, res, next) {

    
    const {email,password,platform,browser,device_id} = req.body;
    try {
      const userData = await userService.login(email,password,platform,browser,device_id)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 1 * 60 * 1000,
        httpOnly: true,
        secure:false
    
      });
      return res.json(userData);
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
  async logout(req, res) {

    try {
      const {refreshToken} = req.cookies;
      console.log('1');
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      // res.json(token)
      req.logout(err => {
        if (err) { return next(err); }
    
        // Destroy session
        req.session.destroy((err) => {
          if (err) {
            console.error('Failed to destroy session during logout:', err);
            return res.status(500).send('Failed to logout');
          }
    
          // Clear the cookie used by the session
          res.clearCookie('connect.sid', { path: '/' });
    
          // Redirect or respond as necessary
          res.send('Logged out and cookies cleared');
        });

    // Get all cookies
    const cookies = req.cookies;

    // Iterate over all cookies and clear them
    for (const cookieName in cookies) {
      res.clearCookie(cookieName);
    }

      });

    // req.logout(function(err) {
    //     if (err) { return next(err); }
    //     res.redirect('http://localhost:3000');
    //   });
    
  
     
    } catch (error) {
      console.log(error);
    }
  }
  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
   
      const userData = await userService.refresh(refreshToken)
      

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      if (!userData) {
        res.clearCookie('refreshToken')
      }
      return res.json(userData);
    } catch (error) {
      console.log(error);
      next(error)
      
    }
  }
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers()
     return res.json(users)
    } catch (error) {
      console.log(error);
    }
  }
  async getUsersByEmail(req, res, next) {
    const {email} = req.body
    console.log(email);
    try {
      const users = await userService.getOneUserByEmail(email)
     return res.json(users)
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserController();



