const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const companyService = require("../service/company-service");
class CompanyController {
  async registerCompany(req, res, next) {
    try {
      const { type, company_name, director_name, director_surname, director_last_name, company_code, legal_address, phone_number } = req.body;

      const result = await companyService.registration(type, company_name, director_name, director_surname, director_last_name, company_code, legal_address, phone_number);

      return res.json(result);
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
  async getCompanies(req, res, next) {
    try {

      const result = await companyService.getAllCompanies();

      return res.json(result);
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
  async searchCompanies(req, res, next) {
 

    const {searchValue} = req.body
    console.log(searchValue);
    
    try {
  // const {value} = req.body
 
  

      const result = await companyService.searchCompanies(searchValue);

      return res.json(result);
    } catch (error) {
      console.log(error);
      next(error)
    }
  }




  async getCompanyType(req, res, next) {
    try {
  

      const result = await companyService.getCompanyType();

      return res.json(result);
    } catch (error) {
      console.log(error);
      next(error)
    }
  }

}

module.exports = new CompanyController();



