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

/**
 * @async
 * @route   POST /api/v1/user/update
 * @returns {User}
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.updateAPI = async (req, res) => {
    const data = req.body.data;
    if (!data) {
        return res.status(401).send(
            Response.unauthorized({
                msg: "You should add user data to create a new user.",
            })
        );
    }

    const result = await userDbInstance.updateUser(data);
    if (!result) {
        return res
            .status(401)
            .send(Response.unauthorized({ msg: "User is not exist." }));
    }
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
    return res.status(200).send(
        Response.successful({
            msg: result._message,
            code: 200,
            data: result,
        })
    );
};

/**
 * @async
 * @route   POST /api/v1/user/post
 * @returns {Post}
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.postAPI = async (req, res) => {
    const data = req.body.data;
    if (!data) {
        return res.status(401).send(
            Response.unauthorized({
                msg: "You should add user data to create a new user.",
            })
        );
    }
    // get user id
    const ref = await userDbInstance.getReference(data);
    const result = await userDbInstance.addPost(data, ref);
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
