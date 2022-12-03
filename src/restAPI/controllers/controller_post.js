const express = require("express");
/* eslint-disable-next-line */
const router = express.Router();
/* eslint-disable-next-line */
const logger = require("../../../logger").logger;
const Response = require("../../common/response").Response;
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
        return res.status(200).send(Response.unknown({}));
    }
    return res.status(200).send(Response.successful({ data: result }));
};
