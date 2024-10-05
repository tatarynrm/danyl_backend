const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user-service");
const usersMessages = require("../service/users-messages");
class UserMessagesController {
  async getUserMessagesController(req, res, next) {
    try {
      const {company_id } = req.body;
      const userMessagesData = await usersMessages.getMessages(company_id && +company_id);
      return res.json(userMessagesData);
    } catch (error) {
      console.log(error);
      next(error)
    }
  }

 
}

module.exports = new UserMessagesController();



