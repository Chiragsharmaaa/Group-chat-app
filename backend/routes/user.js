const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const chatController = require("../controllers/chat");
const middleware = require("../middleware/auth");

router.post("/signup", userController.postSignup);
router.post("/login", userController.postLogin);
router.post("/message", middleware.authentication, chatController.postMessage);

module.exports = router;
