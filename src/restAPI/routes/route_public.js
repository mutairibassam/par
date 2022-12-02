const express = require("express");
const router = express.Router();

// Controller
const controller_appraisal_modules = require("../controllers/controller_public");

/**
 *      /test used to test API connection
 */
router.get("/test", controller_appraisal_modules.testAPI);

module.exports = router;
