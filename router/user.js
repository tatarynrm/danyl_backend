const Router = require('express').Router
const router = new Router();
const userController = require('../controllers/user')
const authMiddleware = require('../middlewares/auth-middlewares')

router.post('/registration',userController.registration)
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.get('/activate/:link')
router.get('/refresh',userController.refresh)
// router.get('/users',authMiddleware, userController.getUsers)
router.get('/users',userController.getUsers)
router.post('/users/by-email', userController.getUsersByEmail)


module.exports = router