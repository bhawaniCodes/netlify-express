const mongoose = require("mongoose");

const { Schema } = mongoose;

const blogSchema = new Schema(
    {
        title: { type: String, required: true },
        subTitle: { type: String },
        body: { type: String, required: true },
        tags: [{ type: String, required: true }],
        coverUrl: { type: String },
        imageName: { type: String },
        email: { type: String },
        wordCount: { type: Number },
        paragraphCount: { type: Number },
        readTime: { type: Number },
        like: { type: Number, default:0},
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const Blog = mongoose.model("blog", blogSchema);
module.exports = Blog;
