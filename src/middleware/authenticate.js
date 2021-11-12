const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, same) {
            if (err) {
                return reject(err);
            } else {
                return resolve(same);
            }
        });
    });
}

async function authenticate(req, res, next) {
    try {
        const bearerToken = req?.headers?.authorization;

        if (!bearerToken || !bearerToken.startsWith("Bearer"))
            return res
                .status(400)
                .send({ message: "Please provide a bearer Token" });

        const token = bearerToken.split(" ")[1];
        console.log("token:", token);

        const { user } = await verifyToken(token);
        console.log("email:", user);
        req.email = user;
        console.log(" req.user.email:", req.email);
        return next();
    } catch (err) {
        return res
            .status(400)
            .send({ message: "Please Provide a valid token" });
    }
}

module.exports = authenticate;
