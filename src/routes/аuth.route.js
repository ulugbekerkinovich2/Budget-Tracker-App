const { register, login } = require("../controllers/auth.controller");
const { Router } = require("express");

const router = Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
