require("dotenv").config();
const mongoose = require("mongoose");

const connect = () => {
    return mongoose.connect(process.env.MONGO_DB_URI);
};

module.exports = connect;
