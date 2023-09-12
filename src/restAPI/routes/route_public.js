const express = require("express");
const router = express.Router();

// Controller
const controller_appraisal_modules = require("../controllers/controller_public");

/**
 *      /test used to test API connection
 */
router.get("/test", controller_appraisal_modules.testAPI);

/**
 *      /create used to create a new user profile
 */
router.put("/create", controller_appraisal_modules.createAPI);

/**
 *      /login used to generate a new token
 */
router.post("/login", controller_appraisal_modules.loginAPI);

/**
 *      /refresh used to refresh [access token]
 */
router.post("/refresh", controller_appraisal_modules.refreshAPI);
module.exports = router;
