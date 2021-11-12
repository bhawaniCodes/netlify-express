const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validationResult } = require("express-validator");

const createToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRET_KEY);
};

const register = async (req, res) => {
    
    let user;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        user = await User.findOne({ email: req.body.email });

        if (user) {
            let match = user.checkPassword(req.body.password);

            if (!match) {
                return res
                    .status(400)
                    .json({ message: "Please check your email or password" });
            }
            const token = createToken(user.email);
            return res.status(200).send({ user, token });
        }
        user = await User.create(req.body);
        const token = createToken(user.email);

        return res.status(200).send({ user, token });
    } catch (err) {
        return res.status(400).send({
            status: "Sorry for the inconvinience",
            message: "Something went wrong",
        });
    }
};

module.exports = { register, createToken };
