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
 *      /request used to pick a new slot
 */
router.get("/requests", controller_appraisal_modules.getAllRequestsAPI);

/**
 *      /request used to pick a new slot
 */
router.post("/request", controller_appraisal_modules.requestNewSlot);

/**
 *      /approve used to pick a new slot
 */
router.post("/approve", controller_appraisal_modules.approveSlot);

/**
 *      /reject used to pick a new slot
 */
router.post("/reject", controller_appraisal_modules.rejectSlot);

/**
 *      /profile used to get user profile 
 */
router.get("/profile/:profile", controller_appraisal_modules.profileAPI);

/**
 *      /profile used to get user profile 
 */
router.get("/profile", controller_appraisal_modules.currentProfileAPI);

module.exports = router;
