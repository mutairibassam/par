const mongoose = require("mongoose");
const { Schema, model } = mongoose;

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
        maxlength: [50, "Bio should be less than 50 characters"],
        trim: true,
    },
    // required
    date: {
        type: String,
        required: true,
    },
    // required
    from: {
        type: String,
        required: true,
    },
    // required
    to: {
        type: String,
        required: true,
    },
    // required
    slots: {
        type: String,
        required: true,
    },
    // required
    occupied: {
        type: String,
        required: true,
        default: "0",
    },
    status: {
        type: String,
        default: "1", // [1 open, 2 deleted, 3 expired]
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
    },
});

postSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const userPost = model("userpost", postSchema);
module.exports = userPost;
