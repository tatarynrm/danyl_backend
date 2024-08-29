const Router = require('express').Router
const router = new Router();
const deviceLogController = require('../controllers/device_settings')
const authMiddleware = require('../middlewares/auth-middlewares')

// Приймаю налаштвання контроллера
router.get('/mainsettings',deviceLogController.saveDeviceLog)

// Приймаю налаштвання finreport
router.get('/mainfinrep',deviceLogController.saveMainfinrep)

// Приймаю налаштвання сервісу апарату
router.get('/mainservice',deviceLogController.saveMainService)

// Приймаю налаштвання сервісу апарату
router.get('/mainter',deviceLogController.saveMainwr)

// Приймаю налаштвання періоду зєднання
router.get('/mainreport',deviceLogController.saveMainreport)

// Приймаю усі логи з апарату
router.get('/mainlogs',deviceLogController.saveAllLogs)


// Віддаю налаштування контроллера
router.get('/mainsettings/:id',deviceLogController.getOneDeviceLog)








module.exports = router