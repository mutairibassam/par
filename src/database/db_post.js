const userProfile = require("../model/user/profile");
const post = require("../model/user/post");
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
        const result = await post.find({}).populate("username").sort({"createdAt": "desc"});
        return result;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

module.exports = { getReference, getTimeline };
