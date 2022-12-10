const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const authSchema = new Schema({
    // required - ref to user profile
    userId: {
        type: Schema.Types.ObjectId,
        ref: "userProfile",
        required: "User id is required.",
        trim: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
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

authSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const auth = model("token", authSchema);
module.exports = auth;
