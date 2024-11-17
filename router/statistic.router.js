const Router = require('express').Router
const router = new Router();
const statisticController = require('../controllers/statistic.controller')




router.post('/liters',statisticController.liters)
router.post('/income-money',statisticController.incomeMoney)


module.exports = router