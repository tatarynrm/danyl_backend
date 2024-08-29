const Router = require('express').Router
const router = new Router();
const AdminController = require('../controllers/admin_water_refund')
const authMiddleware = require('../middlewares/auth-middlewares')

// Приймаю налаштвання контроллера
router.get('/refund-ter-state',AdminController.selectRefundDevice)
router.get('/refund-ter-done',AdminController.doneRefundDevice)










module.exports = router