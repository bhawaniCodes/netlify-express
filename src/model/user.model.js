const mongoose = require('mongoose')
const bcryptjs = require("bcryptjs");

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String },
        avatar: { type: String },
        coverImage: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        tagline: { type: String },
        location: { type: String },
        about: { type: String },
        blogIds: [{ type: String }],
        skill: [{ type: String }],
        social: {
            facebook: { type: String },
            twitter: { type: String },
            linkdin: { type: String },
            websiteUrl: { type: String },
            github: { type: String },
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);



userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const hash = bcryptjs.hashSync(this.password, 8);
    this.password = hash;
    return next();
});

userSchema.methods.checkPassword = function (password) {
    const match = bcryptjs.compareSync(password, this.password);
    return match;
};


const User = mongoose.model("user", userSchema); // if problem occur just put a new
module.exports = User;


// require("dotenv").config();
// const jwt = require("jsonwebtoken");

// const verifyToken = (token) => {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, user) {
//             if (err) return reject(err);
//             return resolve(user);
//         });
//     });
// };

// module.exports = (req, res, next) => {
//     const bearerToken = req?.headers?.authorization;

//     if (!bearerToken)
//         return res
//             .status(200)
//             .json({
//                 status: "error",
//                 message: "Authorization is not present in headers",
//             });

//     if (!bearerToken.startsWith("Bearer "))
//         return res
//             .status(200)
//             .json({
//                 status: "error",
//                 message: "Bearer token is not present in the Authorization",
//             });

//     const token = bearerToken.split(" ")[1];

//     const user = verifyToken(token);

//     if (!user)
//         return res
//             .status(200)
//             .json({ status: "error", message: "Not sended the correct user" });

//     return next();
// };
