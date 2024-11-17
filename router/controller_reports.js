const Router = require('express').Router
const router = new Router();
const controllerReportsController = require('../controllers/controller_reports')


// // Приймаю к-сть внесених купюр
// router.get('/cash',controllerReportsController.saveCashInserted)
// // Приймаю к-сть внесених монет
// router.get('/coin',controllerReportsController.saveCoinsInserted)
// // Приймаю к-сть внесених коштів - PAYPASS
// router.get('/paypass',controllerReportsController.savePaypassInserted)


// Приймаю к-сть внесених коштів 
router.get('/money',controllerReportsController.saveMoneyInserted)


// ВОДА

// Приймаю к-сть виданої апаратом води клієнту
router.get('/liters',controllerReportsController.saveLitersOutInserted)















module.exports = router