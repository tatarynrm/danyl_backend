const Router = require('express').Router
const router = new Router();
const AdminController = require('../controllers/admin_water_refund')
const authMiddleware = require('../middlewares/auth-middlewares')

// Приймаю налаштвання контроллера
router.get('/refund-water-state',AdminController.selectRefundDevice)
router.get('/refund-water-done',AdminController.doneRefundDevice)










module.exports = router