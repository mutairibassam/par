const userProfile = require("../model/user/profile");
const userPost = require("../model/user/post").userPost;
const pickSlot = require("../model/user/post").pickSlot;
// const requestSlot = require("../model/user/post").requestSlot;
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
        const isValid = await result.comparePassword(password);
        return isValid
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

const getAllRequests = async (consumer) => {
    try {
        const filter = { owner : consumer._id };
        const requests = await pickSlot.find(filter).populate("owner").populate("postId").populate("attendees.requester");
        return requests;   
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const requestNewSlot = async (data, consumer) => {

    try {
        /// should return a default status 0
        /// post id, consumer id
        const postId = { postId: data.postId };
        const requestPost = await pickSlot.findOne(postId);

        if (requestPost === null) {
            /// post id does not exist
            return -1;
        }

        requestPost.attendees.requester = consumer._id;
        requestPost.attendees.requesterStatus = "3";

        await requestPost.save();
        return requestPost;
    } catch (error) {
        logger.error("request new slot " + error);
        return error; 
    }

};

const rejectSlot = async (user) => {
    /// should expect a postId
    try {
        // const postId = {postId: user.postId};
        const requesterId = {_id: user.requesterId};
        const post = await pickSlot.findOne(requesterId).populate("postId");

        if (post === null) {
            /// post id does not exist
            return -1;
        }
        post.requestStatus = "2";

        await post.save();

        return post;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const approveSlot = async (user, consumer) => {
    /// should expect a postId and consumer id
    console.log(consumer);
    try {
        // const postId = {postId: user.postId};
        // const pick = await pickSlot.findOne(postId).populate("owner").populate("postId").populate("attendees");

        const requesterId = {_id: user.requesterId};
        const post = await pickSlot.findOne(requesterId).populate("postId");

        if (post === null) {
            /// post id does not exist
            return -1;
        }

        if(post.postId.occupied >= post.postId.slots){
            /// slots has reached its maximum
            return -2;
        }
        /// increment slots with 1
        post.postId.occupied = post.postId.occupied + 1;
        if(post.postId.occupied >= post.postId.slots){
            /// slots has been reached its maximum
            post.status = "3";
        }
        
        /// add new attendees
        post.attendees = [...post.attendees, consumer._id];

        ///! need to save the changes if both pass, for example;
        /// (await pick.save() && await pick.postId.save())
        await post.save();
        await post.postId.save();

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
        return result;
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
    approveSlot,
    getReference,
    getUser,
    isValidated,
    rejectSlot,
    requestNewSlot,
    getAllRequests
};
