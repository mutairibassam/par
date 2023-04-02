const express = require("express");
const router = express.Router();

// Controller
const controller_appraisal_modules = require("../controllers/controller_post");

/**
 *      /timeline used to get all par requests
 */
router.get("/timeline", controller_appraisal_modules.timelineAPI);

/**
 *      /usertimeline used to get timeline for a specific user
 */
router.get("/usertimeline", controller_appraisal_modules.userTimelineAPI);

module.exports = router;
