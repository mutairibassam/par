const express = require("express");
const router = express.Router();

// Controller
const controller_appraisal_modules = require("../controllers/controller_user");

/**
 *      /update used to update a user profile
 */
router.post("/update", controller_appraisal_modules.updateAPI);

/**
 *      /post used to post a new par
 */
router.post("/post", controller_appraisal_modules.postAPI);

/**
 *      /slot used to pick a new slot
 */
router.post("/slot", controller_appraisal_modules.slotAPI);

/**
 *      /profile used to get user profile 
 */
router.get("/profile/:profile", controller_appraisal_modules.profileAPI);

module.exports = router;
