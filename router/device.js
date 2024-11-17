const Router = require('express').Router
const router = new Router();
const deviceController = require('../controllers/device')
const authMiddleware = require('../middlewares/auth-middlewares')

router.post('/',deviceController.getDevices)



// Device create


router.post('/create',deviceController.createDevice)

router.get('/params',deviceController.getDeviceParams)

router.get('/:id',deviceController.getOneDevice)
router.get('/state/:id',deviceController.getOneDeviceState)



router.post('/allDevices',deviceController.getAllDevicesCompany)



router.post('/change-location',deviceController.changeDeviceLocation)



// AdminDevice

// getAllDevicesAdmin

router.get('/admin/devices',deviceController.getAllDevicesAdmin)


module.exports = router