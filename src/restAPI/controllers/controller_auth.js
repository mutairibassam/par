const express = require("express");
/* eslint-disable-next-line */
const router = express.Router();
/* eslint-disable-next-line */
const logger = require("../../../logger").logger;
const Response = require("../../common/response").Response;
const authDbInstance = require("./../../database/db_auth");

const jwt = require("jsonwebtoken");
const process = require("dotenv").config();

function generateAccessToken(user) {
    return jwt.sign(user, process.parsed.ACCESS_TOKEN_SECRET, {
        expiresIn: "360d",
    });
}

/**
 * @async
 * @route   POST /auth/logout
 * @returns None
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.logoutAPI = async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const result = await authDbInstance.removeTokens(token);
    if (!result) {
        return res.status(500).send(Response.unknown({}));
    }
    return res.status(204).send(
        Response.successful({
            msg: "User has been logged out successfully.",
        })
    );
};
/**
 * @async
 * @route   POST /auth/token
 * @returns {object}
 * @author  Bassam
 * @access  public
 * @version 1.0
 */

exports.tokenAPI = async (req, res) => {
    const username = req.user.username;
    const refreshToken = req.body.data.refreshToken;
    if (refreshToken == null) return res.sendStatus(401);
    //if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(
        refreshToken,
        process.parsed.REFRESH_TOKEN_SECRET,
        async (err, user) => {
            if (err) return res.sendStatus(403);  
            const accessToken = generateAccessToken({ name: user.username });
            const newRefreshToken = jwt.sign(
                user,
                process.parsed.REFRESH_TOKEN_SECRET
            );
            const result = await authDbInstance.updateTokens(
                username,
                accessToken,
                newRefreshToken
            );
            return res.status(200).send(
                Response.successful({
                    data: result,
                })
            );
        }
    );
};
