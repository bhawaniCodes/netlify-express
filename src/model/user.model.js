const mongoose = require('mongoose')

const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String },
    avatar: { type: String },
    coverImage: { type: String },
    email: { type: String, required: true, unique: true },
    tagline: { type: String },
    location: { type: String },
    about: { type: String },
    blogIds: [{ type: String }],
    skill: [
        { type: String },
    ],
    social: {
        facebook: { type: String },
        twitter: { type: String },
        linkdin: { type: String },
        websiteUrl: { type: String },
        github: { type: String },
    }
}, {
    versionKey: false,
    timestamps: true
});

const User = mongoose.model("user", userSchema);
module.exports = User;