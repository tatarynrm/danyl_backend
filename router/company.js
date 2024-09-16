const Router = require('express').Router
const router = new Router();
const companyController = require('../controllers/company')
const authMiddleware = require('../middlewares/auth-middlewares')

router.post('/register',companyController.registerCompany)
router.get('/companies',companyController.getCompanies)

router.post('/companies-search',companyController.searchCompanies)

router.get('/company-type',companyController.getCompanyType)
// router.post('/logout',companyController.logout)




module.exports = router