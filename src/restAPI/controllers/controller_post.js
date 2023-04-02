const express = require("express");
/* eslint-disable-next-line */
const router = express.Router();
/* eslint-disable-next-line */
const logger = require("../../../logger").logger;
const Response = require("../../common/response").Response;
const userDbInstance = require("./../../database/db_user");
const postDbInstance = require("./../../database/db_post");
/**
 * @async
 * @route   GET /api/v1/post/timeline
 * @returns {Posts}
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.timelineAPI = async (req, res) => {
    const result = await postDbInstance.getTimeline();
    if (!result) {
        return res.status(500).send(Response.unknown({}));
    }
    return res.status(200).send(Response.successful({ data: result }));
};

/**
 * @async
 * @route   GET /api/v1/post/usertimeline
 * @returns {Posts}
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.userTimelineAPI = async (req, res) => {
    const username = req.user.username;
    const consumer = await userDbInstance.getReference(username);
    if (consumer.level == "error") {
        return res
            .status(400)
            .send(Response.badRequest({ msg: "Username is not exist." }));
    }
    const result = await postDbInstance.getUserTimeline(consumer._id);
    if (!result) {
        return res.status(500).send(Response.unknown({}));
    }
    return res.status(200).send(Response.successful({ data: result }));
};
