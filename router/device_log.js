const Router = require('express').Router
const router = new Router();
const deviceLogController = require('../controllers/device_log')
const authMiddleware = require('../middlewares/auth-middlewares')

router.post('/device',deviceLogController.saveDeviceLog)




module.exports = router