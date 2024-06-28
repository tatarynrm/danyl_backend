const Router = require('express').Router
const router = new Router();
const deviceLogController = require('../controllers/device_settings')
const authMiddleware = require('../middlewares/auth-middlewares')

router.get('/settings',deviceLogController.saveDeviceLog)
router.get('/device/:id',deviceLogController.getOneDeviceLog)




module.exports = router