const {Router} = require("express");
const router = Router();
const {getUsers,updateUserPassword} = require("../controllers/users.controller");
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const isAdminMiddleware = require("../middlewares/check-role.middleware");

router.get("/",isAuthMiddleware,isAdminMiddleware, getUsers);
router.patch("/:id",isAuthMiddleware,isAdminMiddleware, updateUserPassword);
// router.get("/download", downloadTransactionsFile);

module.exports = router;