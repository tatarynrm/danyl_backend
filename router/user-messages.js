const Router = require('express').Router
const router = new Router();

const usersMessagesController = require('../controllers/users-messages');
const authMiddleware = require('../middlewares/auth-middlewares');
// router.get('/users',authMiddleware, userController.getUsers)
router.post('/all',usersMessagesController.getUserMessagesController)



module.exports = router