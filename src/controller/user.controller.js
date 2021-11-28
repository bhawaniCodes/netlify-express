// const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const User = require("../model/user.model");

router.get("/", authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email }).lean().exec();
        return res.status(200).send(user);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.get("/getemail", authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email }).lean().exec();
        return res.status(200).json({ email: user.email });
    } catch (error) {
        console.log("error", error.message);
    }
});

router.patch("/", authenticate, async (req, res) => {
    try {
        const curUser = await User.findOne({ email: req.email }).lean().exec();
        const { _id } = curUser;
        console.log("id:", _id);

        const user = await User.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
        return res.status(200).send(user);
    } catch (error) {
        console.log("error", error.message);
    }
});

module.exports = router;
