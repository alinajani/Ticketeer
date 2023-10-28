const express = require("express");
const router = express.Router();
const countriesController = require("../controller/countriesController.js");

router.delete("/", countriesController.removeAllCountries);

router.post("/populatecountriess", countriesController.populateCountries);

router.get("/GetWholeTable", countriesController.GetWholeTable);

router.get("/getcountrieswithCondition", countriesController.getCountrieswithCondition);

router.post("/AddNewcountries",countriesController.AddNewCountries);

router.put("/Updatecountries",countriesController.Updatecountries);

router.delete("/DeletecountriesAtID",countriesController.DeleteCountriesAtID);

router.delete("/DeletecountrieswithCondition",countriesController.DeleteCountriesWithCondition);


module.exports = router;