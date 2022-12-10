const userProfile = require("../model/user/profile");
const userPost = require("../model/user/post");
const userAuth = require("../model/auth/user");
const logger = require("../../logger").logger;

const addProfile = async (user) => {
    // add user to databas
    try {
        const result = await userProfile.create({
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            bio: user.bio,
            email: user.email,
            mobile: user.mobile,
            external: {
                linkedin: user.external["linkedin"],
                github: user.external["github"],
                twitter: user.external["twitter"],
                portfolio: user.external["portfolio"],
            },
        });
        return result;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const addUser = async (user, password) => {
    // add user to databas
    try {
        const result = await userAuth.create({
            userId: user._id,
            password: password,
        });
        return result;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const isValidated = async (consumer, password) => {
    // add user to databas
    try {
        const filter = { userId: consumer._id };
        // fetch the user and test password verification
        const result = await userAuth.findOne(filter);
        const [isValid, hash] = await result.comparePassword(password);
        if (isValid) return { isValid, hash };
        return { isValid, hash };
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const updateUser = async (user, username) => {
    try {
        const filter = { username: username };
        // options is used to add a new document in case nothing match
        // const options = { upsert: true };
        const replacementDocument = {
            first_name: user.first_name,
            last_name: user.last_name,
            bio: user.bio,
            mobile: user.mobile,
            external: {
                linkedin: user.external["linkedin"],
                github: user.external["github"],
                twitter: user.external["twitter"],
                portfolio: user.external["portfolio"],
            },
        };

        const result = await userProfile.findOneAndUpdate(
            filter,
            replacementDocument,
            {
                new: true,
                runValidators: true,
            }
        );
        return result;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const addPost = async (post, ref) => {
    // add user to databas
    try {
        const result = await userPost.create({
            username: ref,
            location: post.location,
            interest: post.interest,
            note: post.note,
            // city: post.city, // to be added
            date: post.date,
            from: post.from,
            to: post.to,
            slots: post.slots,
            occupied: post.occupied,
            status: post.status,
        });
        return result;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const updateSlot = async (user) => {
    try {
        const filter = { _id: user.postId };
        const post = await userPost.findOne(filter);
        if (post !== null) {
            // check occupied
            if (post.occupied < post.slots) {
                // update occupied
                post.occupied++;
                await post.save();
            } else {
                return -1;
            }
        }
        return post;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const getReference = async (username) => {
    try {
        const filter = { username: username };
        const result = await userProfile.findOne(filter);
        return result._id;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const getUser = async (username) => {
    try {
        const filter = { username: username };
        const result = await userProfile.findOne(filter);
        return result;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

module.exports = {
    addProfile,
    addUser,
    updateUser,
    addPost,
    updateSlot,
    getReference,
    getUser,
    isValidated,
};
