const express = require("express");
const router = express.Router();

// Controller
const controller_appraisal_modules = require("../controllers/controller_post");

/**
 *      /timeline used to get all par requests
 */
router.get("/timeline", controller_appraisal_modules.timelineAPI);

module.exports = router;
