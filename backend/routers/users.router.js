const express = require("express")
const app = express()
const router = app.router
const userController = require("../controllers/users.controller")
const checkToken = require("../middleware/check_token").checkToken

    router.get("/", checkToken, userController.GetAll)
    router.post("/", userController.PostNew)
    router.post("/login", userController.Login)

module.exports = router;

