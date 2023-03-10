const mongoose = require("mongoose");
const { Schema, model } = mongoose;

//var validateEmail = function (email) {
//    /* eslint-disable-next-line */
//    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//    return re.test(email);
//};

const externalSchema = new Schema({
    linkedin: String,
    github: String,
    twitter: String,
    portfolio: String,
});

const userProfileSchema = new Schema({
    // required
    first_name: {
        type: String,
        required: "First name is required.",
        trim: true,
    },
    // required
    last_name: {
        type: String,
        trim: true,
    },
    // required
    username: {
        type: String,
        required: "Username is required.",
        //unique: true,
        trim: true,
    },
    // required
    bio: {
        type: String,
        maxlength: [150, "Bio should be less than 150 characters"],
        trim: true,
    },
    // required
    email: {
        type: String,
        required: "Email address is required.",
        lowercase: true,
        //unique: true,
        //validate: [validateEmail, "Email address is not valid"],
        trim: true,
    },
    // optional
    mobile: {
        type: String,
        //minlength: 10,
        //maxlength: 10,
        //match: [new RegExp("^[0-9]+$"), "Mobile should contain only numbers."],
        trim: true,
    },
    external: {
        type: externalSchema,
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

userProfileSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const userProfile = model("userProfile", userProfileSchema);
module.exports = userProfile;
