// const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const User = require("../model/user.model");
const Blog = require("../model/blog.model");
const authenticate = require("../middleware/authenticate");

router.get("/one", authenticate, async (req, res) => {
    try {
        const blogs = await Blog.find({ email: req.email }).lean().exec();
        return res.status(200).json(blogs);
    } catch (error) {
        console.log("error", error.message);
    }
});

router.get("/:id", authenticate, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).lean().exec();
        return res.status(200).json({blog});
    } catch (error) {
        console.log("error", error.message);
    }
});


router.post(
    "/", authenticate,
    async (req, res) => {
        try {
            const blog = await Blog.create(req.body);
            const blogId = blog.id; // Recently Created blog's id

            const user = await User.findOne({ email: req.email })
                .lean()
                .exec();
            // const user = await User.findById(req.params.id).lean().exec();
            const blogIdArray = user.blogIds;
            blogIdArray.push(blogId);

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

router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find().lean().exec();
        return res.status(200).json(blogs);
    } catch (error) {
        console.log("error", error.message);
    }
});

router.patch("/:id", async (req, res) => {
    try {
        // const curUser = await Blog.findOne({ email: req.email }).lean().exec();
        // const { _id } = curUser;

        const blog = await Blog.findByIdAndUpdate(req.params.id, { like: req.body.like }, {
            new: true
        });
        return res.status(200).send(blog);
    } catch (error) {
        console.log("error", error.message);
    }
});


module.exports = router;
