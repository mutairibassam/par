const userProfile = require("../model/user/profile");
const userPost = require("../model/user/post").userPost;
const logger = require("../../logger").logger;

const getReference = async (user) => {
    try {
        const filter = { username: user.username };
        const result = await userProfile.findOne(filter);
        return result._id;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const getTimeline = async () => {
    try {
        const result = await userPost
            .find({})
            .populate("username")
            .sort({ createdAt: "desc" });
        return result;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const getUserTimeline = async (userObj) => {
    try {
        const result = await userPost
            .find({})
            .where("username")
            .equals(userObj)
            .populate("username")
            .exec();
        return result;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

module.exports = { getReference, getTimeline, getUserTimeline };
