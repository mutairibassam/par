const userProfile = require("../model/user/profile");
const userPost = require("../model/user/post").userPost;
const slot = require("../model/user/post").slot;
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
        return isValid;
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
        const requests = await slot.find(filter).populate("owner").populate("postId").populate("attendees.requester");
        return requests;   
    } catch (error) {
        logger.error(error);
        return error;
    }
};

const requestNewSlot = async (data, consumer) => {

    try {
        const filter = {postId:  data.postId};

        const newRequester = {
            $push: {
                "attendees": {
                    "requester":consumer._id,
                    "requestStatus": "3"
                }
            }
        };

        /// TODO reject if user requesting for himself
        const result = await slot.updateOne(
            filter,
            newRequester
        );        
        return result;
    } catch (error) {
        logger.error("request new slot " + error);
        if(error["name"] === "CastError") return -1;
        return error; 
    }

};

const rejectSlot = async (data, consumer) => {
   /// should expect a postId and consumer id
   try {

    const ownerValue = consumer._id;
    const postValue = data.postId;
    const requesterValue = data.requesterId;
    const post = await slot.findOne({}).where("postId").equals(postValue).populate("postId").exec();
    
    if (post === null) {
        /// post id does not exist
        return -1;
    }
    if(post.owner.toString() != ownerValue) {
        return -3;
    }
    
    /// change requester status to approve
    post.attendees.map((obj) => {
        /// iterate over attendees list to update the status of the requester
        if(obj.requester.toString() === requesterValue) {
            obj.requestStatus = "2";
        }
    });

    ///! need to save the changes if both pass, for example;
    /// (await pick.save() && await pick.postId.save())
    await post.save();
    // await post.postId.save();

    return post;
} catch (error) {
    logger.error(error);
    return error;
}
};

const approveSlot = async (data, consumer) => {
    /// should expect a postId and consumer id
    try {

        const ownerValue = consumer._id;
        const postValue = data.postId;
        const requesterValue = data.requesterId;
        const post = await slot.findOne({}).where("postId").equals(postValue).populate("postId").exec();
        
        if (post === null) {
            /// post id does not exist
            return -1;
        }
        if(post.owner.toString() != ownerValue) {
            return -3;
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
        /// change requester status to approve
        post.attendees.map((obj) => {
            if(obj.requester.toString() === requesterValue) {
                obj.requestStatus = "1";
            }
        });

        ///! need to save the changes if both pass, for example;
        /// (await pick.save() && await pick.postId.save())
        await post.save();
        // await post.postId.save();

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
