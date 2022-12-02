const express = require("express");
/* eslint-disable-next-line */
const router = express.Router();
/* eslint-disable-next-line */
const logger = require("../../../logger").logger;

/**
 * @async
 * @route   GET /api/v1/public/test
 * @returns {object} test API
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.testAPI = async (req, res) => {
    res.status(200).send({
        message: "Test API Works",
        code: 200,
        success: true,
        data: [],
    });
};
