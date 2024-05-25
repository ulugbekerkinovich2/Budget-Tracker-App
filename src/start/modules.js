const fileUpload = require("express-fileupload");
const cors = require("cors");
const zip = require('express-zip');
const authRoute = require("../routes/аuth.route");
const usersRoute = require("../routes/users.route");
const categoryRoute = require("../routes/category.route");
const balanceRoute = require("../routes/transaction.route");
const isAuthMiddleware = require("../middlewares/is-auth.middleware")

const modules = (app, express) => {
    app.use(cors());
    app.use(fileUpload());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(`${process.cwd()}/uploads`));
    app.use("/api/auth", authRoute);
    app.use("/api/users", usersRoute);
    app.use("/api/category", categoryRoute);
    app.use("/api/transaction", balanceRoute)
};

module.exports = modules;
