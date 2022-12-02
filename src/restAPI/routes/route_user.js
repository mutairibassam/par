const express = require("express");
const router = express.Router();

// Controller
const controller_appraisal_modules = require("../controllers/controller_user");

/**
 *      /create used to create a new user profile
 */
router.post("/create", controller_appraisal_modules.createAPI);

/**
 *      /update used to update a user profile
 */
//router.post("/update", controller_appraisal_modules.updateAPI);

module.exports = router;
