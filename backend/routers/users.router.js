const express = require("express");

const userController = require("../controllers/users.controller");
const { checkToken } = require("../middleware/check_token");

const router = express.Router();

router.post("/register", userController.register);
router.post("/create", userController.register);
router.post("/login", userController.login);
router.get("/me", checkToken, userController.me);
router.get("/", checkToken, userController.getAll);
router.get("/friends", checkToken, userController.listFriends);
router.post("/friends", checkToken, userController.addFriend);
router.get("/add/:username", checkToken, userController.addFriendFromParams);

module.exports = router;
