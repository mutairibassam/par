const userProfile = require("../model/user/profile");
const auth = require("../model/user/auth");
const logger = require("../../logger").logger;

const addTokens = async (user, _accessToken, _refreshToken) => {
    try {
        const filter = { username: user.username };
        const profile = await userProfile.findOne(filter);

        const data = {
            userId: profile._id,
            accessToken: _accessToken,
            refreshToken: _refreshToken,
        };
        //const result = await auth.findOneAndUpdate(filter, data);
        const result = await auth.insertMany(data);
        return result;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const removeTokens = async (token) => {
    try {
        const result = await auth.findOneAndRemove({ accessToken: token });
        return result;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const updateTokens = async (id, _accessToken, newRefreshToken) => {
    try {
        const filter = { _id : id };
        const profile = await userProfile.findOne(filter);
        const updateFilter = { userId: profile._id };

        const result = await auth.findOne(updateFilter);
        if(result !== null) {
            result.accessToken = _accessToken;
            result.refreshToken = newRefreshToken;
            result.save();
        } else {
            return false
        }
        return result;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const getToken = async (id) => {
    try {
        const filter = { userId: id };
        const profile = await auth.findOne(filter);
        return profile.accessToken;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

/// need to be optimized using native `where()`
const getTokenByUsername = async (_username) => {
    try {
        const profile = await auth.find({}).populate("userId");
        const query2 = profile.filter((x) => { if(x.userId.username === _username) return x.accessToken;});
        if(query2[0].accessToken !== null) {
            return query2[0].accessToken;
        }
        return false;
    } catch (error) {
        // logger.error(error);
        return error;
    }
};

module.exports = { addTokens, removeTokens, updateTokens, getToken, getTokenByUsername };
