// const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const User = require("../model/user.model");
const Blog = require("../model/blog.model");
const authenticate = require("../middleware/authenticate");

router.post(
    "/", authenticate,
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
            const blog = await Blog.create(req.body);
            const blogId = blog.id; // Recently Created blog's id

            console.log("blogId:", blogId);
            const user = await User.findOne({ email: req.email })
                .lean()
                .exec();
            // const user = await User.findById(req.params.id).lean().exec();
            const blogIdArray = user.blogIds;
            blogIdArray.push(blogId);
            console.log("blogIdArray:", user._id);

            const userUpdate = await User.findByIdAndUpdate(
                user._id,
                {blogIds : blogIdArray},
                {
                    new: true,
                }
            );
            return res.status(200).json({ userUpdate });
        } catch (error) {
            console.log("error", error.message);
        }
    }
);

router.get("/:id", authenticate, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).lean().exec();
        return res.status(200).json(blog);
    } catch (error) {
        console.log("error", error.message);
    }
});
router.get("/one", authenticate, async (req, res) => {
    try {
        const blogs = await Blog.findOne({email: req.email}).lean().exec();
        return res.status(200).json(blogs);
    } catch (error) {
        console.log("error", error.message);
    }
});
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email }).lean().exec();
        const blogIdArray = user.blogIds;
        const newBlogIdArray = blogIdArray.filter((item) => item !== req.params.id)
        
        const blog = await Blog.findByIdAndDelete(req.params.id);

         const userUpdate = await User.findByIdAndUpdate(
             user._id,
             { blogIds: newBlogIdArray },
             {
                 new: true,
             }
         );


        return res.status(200).send({ blog, userUpdate });
    } catch (error) {
        console.log("error", error.message);
    }
});

// router.get("/", async (req, res) => {
//     try {
//         const blogs = await Blog.find().lean().exec();
//         return res.status(200).json(blogs);
//     } catch (error) {
//         console.log("error", error.message);
//     }
// });

module.exports = router;
