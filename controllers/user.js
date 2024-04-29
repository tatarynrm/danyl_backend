const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
class UserController {
  async registration(req, res, next) {
    try {
      const { email, password,platform,browser,device_id,name,surname,lastname,phone_number,role_id } = req.body;
      // const userData = await userService.registration(email, password,platform,browser,device_id);
      const userData = await userService.registration(email, password,name,surname,lastname,phone_number,role_id);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
  async login(req, res, next) {
    const {email,password,platform,browser,device_id} = req.body;
    console.log(req.body);
    try {
      const userData = await userService.login(email,password,platform,browser,device_id)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
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
      res.clearCookie('refreshToken')
      return res.json(token)
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



