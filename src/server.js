const cors = require('cors');
require('dotenv').config();
const express = require('express');
const app = express();
const connect = require('./config/db')
app.use(express.json());
app.use(cors());
const port = process.env.PORT;
const userController = require('./controller/user.controller');
app.use('/users', userController)
const blogController = require('./controller/blog.controller');
app.use('/blogs', blogController)

app.listen(port, async () => {
    await connect();
    console.log(`Listening to port  ${port}`);
});
