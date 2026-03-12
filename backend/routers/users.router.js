const express = require("express")
const app = express()
const router = app.router
const userController = require("../controllers/users.controller")

    router.get("/", userController.GetAll)

module.exports = router;

