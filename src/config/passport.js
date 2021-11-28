require("dotenv").config();
const { createToken } = require("../controller/auth.controller");

const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");

const User = require("../model/user.model");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:
                "https://hashnode-clone-api.herokuapp.com/auth/google/callback",
            passReqToCallback: true,
        },
        async function (request, accessToken, refreshToken, profile, done) {
            // console.log('profile, done:', profile, done)
            try {
                let user = await User.findOne({ email: profile?._json.email })
                    .lean()
                    .exec();

                if (!user)
                    user = await User.create({
                        email: profile?._json.email,
                        name: profile?._json.name,
                    });
                const token = createToken(user.email);
                // console.log('token:', token, user)
                return done(null, { user, token });
            } catch (err) {
                return done(null, err);
            }
        }
    )
);

module.exports = passport;
