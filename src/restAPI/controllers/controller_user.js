const express = require("express");
/* eslint-disable-next-line */
const router = express.Router();
const Response = require("../../common/response").Response;
const userDbInstance = require("./../../database/db_user");

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
    const username = req.user.username;
    if (!data) {
        return res.status(401).send(
            Response.unauthorized({
                msg: "You should add user data to create a new user.",
            })
        );
    }

    const result = await userDbInstance.updateUser(data, username);
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
    const username = req.user.username;
    if (!data) {
        return res.status(401).send(
            Response.unauthorized({
                msg: "You should add user data to create a new user.",
            })
        );
    }
    // get user id
    const ref = await userDbInstance.getReference(username);
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

/**
 * @async
 * @route   POST /api/v1/user/slot
 * @returns {Post}
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.slotAPI = async (req, res) => {
    const data = req.body.data;
    const username = req.user.username;
    if (!data) {
        return res.status(401).send(
            Response.unauthorized({
                msg: "You should add user data to create a new user.",
            })
        );
    }
    // get user id who wants to pick a slot
    const consumer = await userDbInstance.getReference(username);
    if (consumer.level == "error") {
        return res
            .status(400)
            .send(Response.badRequest({ msg: "Username is not exist." }));
    }
    const result = await userDbInstance.updateSlot(data, consumer);
    if (result === null) {
        return res.status(400).send(
            Response.badRequest({
                msg: "Invalid post id.",
            })
        );
    }
    if (result.level === "error") {
        return res.status(400).send(
            Response.badRequest({
                msg: result.message,
            })
        );
    }
    if (result.code === 11000) {
        return res.status(400).send(
            Response.badRequest({
                msg: result.message,
            })
        );
    }
    if (result == -1) {
        return res.status(403).send(
            Response.unauthorized({
                msg: "Slot id does not exist.",
            })
        );
    }
    if (result == -2) {
        return res.status(403).send(
            Response.unauthorized({
                msg: "Slots reach its maximum.",
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

exports.getAllRequestsAPI = async (req, res) => {
    const username = req.user.username;
    // get user id who wants to pick a slot
    const consumer = await userDbInstance.getReference(username);
    if (consumer.level == "error") {
        return res
            .status(400)
            .send(Response.badRequest({ msg: "Username is not exist." }));
    }

    const result = await userDbInstance.getAllRequests(consumer);

    if (result.level === "error" || result.code === 11000 || result === null) {
        return res.status(400).send(
            Response.badRequest({
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

exports.requestNewSlot = async (req, res) => {
    /// need post id
    const data = req.body.data;
    const username = req.user.username;
    if (!data) {
        return res.status(401).send(
            Response.unauthorized({
                msg: "You should add post Id.",
            })
        );
    }
    // get user id who wants to pick a slot
    const consumer = await userDbInstance.getReference(username);
    if (consumer.level == "error") {
        return res
            .status(400)
            .send(Response.badRequest({ msg: "Username is not exist." }));
    }

    const result = await userDbInstance.requestNewSlot(data, consumer);
    if (result === null) {
        return res.status(400).send(
            Response.badRequest({
                msg: "Invalid post id.",
            })
        );
    }
    if (result.level === "error") {
        return res.status(400).send(
            Response.badRequest({
                msg: result.message,
            })
        );
    }
    if (result.code === 11000) {
        return res.status(400).send(
            Response.badRequest({
                msg: result.message,
            })
        );
    }
    if (result == -1) {
        return res.status(403).send(
            Response.unauthorized({
                msg: "Slot id does not exist.",
            })
        );
    }
    if (result == -2) {
        return res.status(403).send(
            Response.unauthorized({
                msg: "Slots reach its maximum.",
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

exports.approveSlot = async (req, res) => {
    const data = req.body.data;
    const username = req.user.username;
    if (!data) {
        return res.status(401).send(
            Response.unauthorized({
                msg: "You should add post Id.",
            })
        );
    }
    // get user id who wants to pick a slot
    const consumer = await userDbInstance.getReference(username);
    if (consumer.level == "error") {
        return res
            .status(400)
            .send(Response.badRequest({ msg: "Username is not exist." }));
    }
    const result = await userDbInstance.approveSlot(data, consumer);
    if (result === null) {
        return res.status(400).send(
            Response.badRequest({
                msg: "Invalid post id.",
            })
        );
    }
    if (result.level === "error") {
        return res.status(400).send(
            Response.badRequest({
                msg: result.message,
            })
        );
    }
    if (result.code === 11000) {
        return res.status(400).send(
            Response.badRequest({
                msg: result.message,
            })
        );
    }
    if (result == -1) {
        return res.status(403).send(
            Response.unauthorized({
                msg: "Slot id does not exist.",
            })
        );
    }
    if (result == -2) {
        return res.status(403).send(
            Response.unauthorized({
                msg: "Slots reach its maximum.",
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

exports.rejectSlot = async (req, res) => {
    const data = req.body.data;
    // const username = req.user.username;
    if (!data) {
        return res.status(401).send(
            Response.unauthorized({
                msg: "You should add post Id.",
            })
        );
    }
    // // get user id who wants to pick a slot
    // const consumer = await userDbInstance.getReference(username);
    // if (consumer.level == "error") {
    //     return res
    //         .status(400)
    //         .send(Response.badRequest({ msg: "Username is not exist." }));
    // }
    const result = await userDbInstance.rejectSlot(data);
    if (result === null) {
        return res.status(400).send(
            Response.badRequest({
                msg: "Invalid post id.",
            })
        );
    }
    if (result.level === "error") {
        return res.status(400).send(
            Response.badRequest({
                msg: result.message,
            })
        );
    }
    if (result.code === 11000) {
        return res.status(400).send(
            Response.badRequest({
                msg: result.message,
            })
        );
    }
    if (result == -1) {
        return res.status(403).send(
            Response.unauthorized({
                msg: "Slot id does not exist.",
            })
        );
    }
    if (result == -2) {
        return res.status(403).send(
            Response.unauthorized({
                msg: "Slots reach its maximum.",
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
 * @route   GET /api/v1/user/profile
 * @returns {User}
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.profileAPI = async (req, res) => {
    const username = req.params.profile;
    // get user id who wants to pick a slot
    const consumer = await userDbInstance.getUser(username);

    if (consumer === null || consumer === undefined || consumer.level == "error") {
        return res
            .status(400)
            .send(Response.badRequest({ msg: "Username is not exist." }));
    }
    if (consumer.code === 11000) {
        return res.status(400).send(
            Response.badRequest({
                msg: consumer.message,
            })
        );
    }
    return res.status(200).send(
        Response.successful({
            msg: consumer._message,
            code: 200,
            data: consumer,
        })
    );
};
/**
 * @async
 * @route   GET /api/v1/user/profile
 * @returns {User}
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.currentProfileAPI = async (req, res) => {
    const username = req.user.username;
    // get user id who wants to pick a slot
    const consumer = await userDbInstance.getUser(username);

    if (consumer === null || consumer === undefined || consumer.level == "error") {
        return res
            .status(400)
            .send(Response.badRequest({ msg: "Username is not exist." }));
    }
    if (consumer.code === 11000) {
        return res.status(400).send(
            Response.badRequest({
                msg: consumer.message,
            })
        );
    }
    return res.status(200).send(
        Response.successful({
            msg: consumer._message,
            code: 200,
            data: consumer,
        })
    );
};
