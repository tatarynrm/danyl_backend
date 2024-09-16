const Router = require('express').Router
const router = new Router();
const deviceController = require('../controllers/device')
const authMiddleware = require('../middlewares/auth-middlewares')

router.get('/',deviceController.getDevices)



// Device create


router.post('/create',deviceController.createDevice)

router.get('/params',deviceController.getDeviceParams)

router.get('/:id',deviceController.getOneDevice)
router.get('/state/:id',deviceController.getOneDeviceState)

module.exports = router