const Router = require('express').Router
const router = new Router();
const deviceLogController = require('../controllers/device_log')
const authMiddleware = require('../middlewares/auth-middlewares')

router.get('/device',deviceLogController.saveDeviceLog)
router.post('/device/:id',deviceLogController.getOneDeviceLog)




module.exports = router