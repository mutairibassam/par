const express = require("express");
/* eslint-disable-next-line */
const router = express.Router();
const Response = require("../../common/response").Response;
const userDbInstance = require("./../../database/db_user");

/**
 * @async
 * @route   POST /api/v1/user/create
 * @returns {User}
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.createAPI = async (req, res) => {
    const data = req.body.data;
    console.log(data);
    if (!data) {
        return res.status(401).send(
            Response.unauthorized({
                msg: "You should add user data to create a new user.",
            })
        );
    }
    const result = await userDbInstance.addUser(data);
    if (result.code === 11000) {
        return res.status(401).send(
            Response.unauthorized({
                msg: result.message,
            })
        );
    }
    if (result.level === "error") {
        return res.status(401).send(
            Response.unauthorized({
                msg: result.message,
            })
        );
    }
    return res.status(201).send(
        Response.successful({
            msg: result._message,
            code: 201,
            data: result,
        })
    );
};
