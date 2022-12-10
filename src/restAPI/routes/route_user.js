const express = require("express");
const router = express.Router();

// Controller
const controller_appraisal_modules = require("../controllers/controller_user");

/**
 *      /update used to update a user profile
 */
router.post("/update", controller_appraisal_modules.updateAPI);

/**
 *      /update used to post a new par
 */
router.post("/post", controller_appraisal_modules.postAPI);

/**
 *      /update used to pick a newe slot
 */
router.post("/slot", controller_appraisal_modules.slotAPI);

module.exports = router;
