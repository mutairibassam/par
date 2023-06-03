const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const slotSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "userProfile",
        required: true,
        immutable: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "userpost",
        required: true,
        immutable: true,
    },
    attendees: [{
        requester: {
            type: Schema.Types.ObjectId,
            ref: "userProfile"
        },
        requestStatus: String,
    }],
    // auto-generated from backend
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    // auto-generated from backend
    updatedAt: {
        type: Date,
    }
});

const postSchema = new Schema({
    // required - ref to user profile
    username: {
        type: Schema.Types.ObjectId,
        ref: "userProfile",
        required: "Username is required.",
        trim: true,
    },
    // required
    location: {
        type: String,
        required: true,
        trim: true,
    },
    // optional
    interest: {
        type: Object,
    },
    // optional
    note: {
        type: String,
        maxlength: [100, "Bio should be less than 100 characters"],
        trim: true,
    },
    // required
    date: {
        type: String,
        required: true,
    },
    // required
    from: {
        ///! should be timestamp
        type: String,
        required: true,
    },
    // required
    to: {
        ///! should be timestamp
        type: String,
        required: true,
    },
    // required
    slots: {
        type: Number,
        default: 3,
        required: true,
    },
    // required
    occupied: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: "1", // [1 open, 2 expired, 3 full]
    },
    // auto-generated from backend
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    // auto-generated from backend
    updatedAt: {
        type: Date,
    }
});

postSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

postSchema.post("save", function (doc) {
    slot.create({
        owner: doc.username,
        postId: doc._id,
    });
});

const userPost = model("userpost", postSchema);
const slot = model("slot", slotSchema);

module.exports = { userPost , slot};
