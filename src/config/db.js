require("dotenv").config();
const mongoose = require("mongoose");

const connect = () => {
    // After host if issue came then take url here& hide id & password only
    return mongoose.connect(process.env.MONGO_DB_URI);
};

module.exports = connect;
