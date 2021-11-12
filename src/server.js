const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();
const connect = require("./config/db");
const { body } = require("express-validator");
app.use(express.json());
app.use(cors());
const port = process.env.PORT;
const userController = require("./controller/user.controller");
app.use("/users", userController);
const blogController = require("./controller/blog.controller");
const { register } = require("./controller/auth.controller");
const passport = require("./config/passport");
app.use(passport.initialize());
app.use("/blogs", blogController);

app.post(
    "/register",
    body("email")
        .isEmail()
        .withMessage("email is required & it should be in email format only"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("Password must contain a number"),

    register
);

// Google authentication
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:3000/login",
    }),
    (req, res) => {
        return res.redirect(`http://localhost:3000/index?token=${req.user.token}`);
    }
);

app.listen(port, async () => {
    await connect();
    console.log(`Listening to port  ${port}`);
});
