// const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const User = require("../model/user.model");

router.post(
    "/",
    // body("first_name").not().isEmpty().withMessage("Please enter first name"),
    // body("last_name")
    //     .isLength({ min: 1 })
    //     .withMessage("Please enter last name"),
    // body("email")
    //     .isEmail()
    //     .withMessage("email is required & it should be in email format only"),
    // body("pincode")
    //     .isLength({ min: 6, max: 6 })
    //     .withMessage("pincode is required & should be length of 6"),
    // body("age").isFloat({ min: 1, max: 100 }).withMessage("age is required"),
    // body("gender")
    //     .toLowerCase()
    //     .isIn(["male", "female", "others"])
    //     .withMessage("gender should be only Male, Female or Others"),

    // const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res
    //             .status(400)
    //             .json({ errors: errors.array(), message: "server error" });
    //     }

    async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email })
                .lean()
                .exec();
            if (user) {
                return res.status(200).json({ user });
            }
            const newUser = await User.create(req.body);
            return res.status(200).json({ newUser });
        } catch (error) {
            console.log("error", error.message);
        }
    }
);

router.get("/", authenticate, async (req, res) => {
    try {
        console.log("gerRouter: ", req.email);
        const user = await User.findOne({ email: req.email }).lean().exec();
        return res.status(200).send(user);
    } catch (error) {
        return res.status(400).send(error.message);
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
