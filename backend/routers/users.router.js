const express = require("express")
const app = express()
const router = app.router
const userController = require("../controllers/users.controller")
const checkToken = require("../middleware/check_token").checkToken

    router.get("/", userController.GetAll)
    router.post("/create", userController.Register)
    router.post("/login", userController.Login)
    router.get("/add/:username", checkToken, userController.Add)
    router.get("/friends", checkToken, userController.ShowFriends)
    router.get("/me", checkToken, userController.getMyInfo)

module.exports = router;

