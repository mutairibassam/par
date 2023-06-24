const express = require("express");
/* eslint-disable-next-line */
const router = express.Router();
/* eslint-disable-next-line */
const logger = require("../../../logger").logger;
const Response = require("../../common/response").Response;
const userDbInstance = require("./../../database/db_user");
const authDbInstance = require("./../../database/db_auth");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const process = require("dotenv").config();
var nodemailer = require("nodemailer");

function generateAccessToken(user) {
    return jwt.sign(user, process.parsed.ACCESS_TOKEN_SECRET, {
        expiresIn: "360d",
    });
}

function generatePassword() {
    const length = 20;
    const wishlist =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$";
    return Array.from(crypto.randomFillSync(new Uint32Array(length)))
        .map((x) => wishlist[x % wishlist.length])
        .join("");
}

async function sendEmail(password, userEmail) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    /* eslint-disable-next-line */
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            logger.error(err);
            console.error("Failed to create a testing account. " + err.message);
            return process.exit(1);
        }
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.parsed.GMAIL_NODEMAILER_EMAIL,
                pass: process.parsed.GMAIL_NODEMAILER_PASS
            },
            // host: account.smtp.host,
            // port: account.smtp.port,
            // secure: account.smtp.secure,
            // auth: {
            //     user: account.user,
            //     pass: account.pass,
            // },
            // host: "smtp.ethereal.email",
            // port: 587,
            // secure: false, // true for 465, false for other ports
            // auth: {
            //     user: testAccount.user, // generated ethereal user
            //     pass: testAccount.pass, // generated ethereal password
            // },
        });

        // Message object
        let message = {
            from: "Par Customer Care <mutairibassam@gmail.com>", // sender address
            to: userEmail, // list of receivers
            subject: "Par login code", // Subject line
            text: password,
            html: `<p>Please use below code to login:</p> </br><b>${password}</b>`, // html body
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                logger.error(err);
                console.log("Error occurred. " + err.message);
                return process.exit(1);
            }
            logger.info(info.response);

            // console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}

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
    // generate password
    const result = await userDbInstance.addProfile(data);
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
    // send password to users
    const passwd = generatePassword();
    console.log(passwd);
    const user = await userDbInstance.addUser(result, passwd);
    if (user.code === 11000) {
        return res.status(401).send(
            Response.unauthorized({
                msg: user.message,
            })
        );
    }
    if (user.level === "error") {
        return res.status(401).send(
            Response.unauthorized({
                msg: user.message,
            })
        );
    }
    const filter = { username: result.username };
    const accessToken = generateAccessToken(filter);
    const refreshToken = jwt.sign(filter, process.parsed.REFRESH_TOKEN_SECRET);
    const tokens = await authDbInstance.addTokens(
        data,
        accessToken,
        refreshToken
    );
    if (tokens.code === 11000) {
        return res.status(401).send(
            Response.unauthorized({
                msg: tokens.message,
            })
        );
    }
    if (tokens.level === "error") {
        return res.status(401).send(
            Response.unauthorized({
                msg: tokens.message,
            })
        );
    }
    sendEmail(passwd, data.email);
    return res.status(201).send(
        Response.successful({
            msg: result._message,
            code: 201,
            data: { result, tokens },
        })
    );
};

/**
 * @async
 * @route   POST /api/v1/public/login
 * @returns {Token} Login API
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.loginAPI = async (req, res) => {
    // Authenticate User

    const username = req.body.data.username;
    const password = req.body.data.password;

    if (!username || !password) {
        return res.status(401).send(
            Response.unauthorized({
                msg: "You should add user data to create a new user.",
            })
        );
    }
    const consumer = await userDbInstance.getUser(username);
    if (!consumer || consumer.level == "error") {
        return res
            .status(400)
            .send(Response.badRequest({ msg: "Username is not exist." }));
    }

    const isValid = await userDbInstance.isValidated(consumer, password);
    if (!isValid) {
        return res
            .status(400)
            .send(Response.unauthorized({ msg: "Password is incorrect." }));
    }
    const user = { username: consumer.username };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.parsed.REFRESH_TOKEN_SECRET);
    const result = await authDbInstance.updateTokens(
        consumer._id,
        accessToken,
        refreshToken
    );
    if (result.level == "error") {
        return res
            .status(400)
            .send(Response.badRequest({ msg: "Username is not exist." }));
    }
    if (!result) {
        const tokens = await authDbInstance.addTokens(
            consumer,
            accessToken,
            refreshToken
        );
        return res.status(200).send(
            Response.successful({
                data: {
                    user: tokens,
                },
            })
        );
    }
    return res.status(200).send(
        Response.successful({
            data: {
                user: result,
            },
        })
    );
};
