const Router = require('express').Router
const router = new Router();
const deviceLogController = require('../controllers/device_settings')
const authMiddleware = require('../middlewares/auth-middlewares')

// Приймаю налаштвання контроллера
router.get('/savemainset',deviceLogController.saveDeviceLog)




// Приймаю налаштвання finreport
router.get('/mainfinrep',deviceLogController.saveMainfinrep)




// Приймаю налаштвання періоду зєднання
router.get('/mainrep',deviceLogController.saveMainreport)



// Приймаю налаштвання сервісу апарату
router.get('/mainserv',deviceLogController.saveMainService)



// Приймаю налаштвання сервісу апарату
router.get('/mainter',deviceLogController.saveMainwr)









// Приймаю усі логи з апарату
router.get('/mainlog',deviceLogController.saveAllLogs)





// Віддаю налаштування контроллера
router.get('/getmainset/:id',deviceLogController.getOneDeviceLog)











// ЗРОБИТИ  17.11.2024

// Звіт проданої води
// router.get('/mainvoda',deviceLogController)



// Відправляєш запит 0=36000, 
// router.get('/getmoney',deviceLogController)





// Тарас мені відправляє фінансові операції 
// 0 - готівка 1- монети 2- пейпас
// router.get('/mainfop',deviceLogController)



















module.exports = router