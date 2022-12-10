const express = require("express");
const router = express.Router();

// Controller
const controller_appraisal_modules = require("../controllers/controller_auth");

/**
 *      /logout used to remove an existing token
 */
router.delete("/logout", controller_appraisal_modules.logoutAPI);

/**
 *      /token used to validate jwt token
 */
router.post("/token", controller_appraisal_modules.tokenAPI);

/**
 *      /check used to check token validity
 */
//router.get("/check", controller_appraisal_modules.checkAPI);

/**
 *      /token used to validate jwt token
 */
//router.post("/reset", controller_appraisal_modules.resetAPI);

module.exports = router;
