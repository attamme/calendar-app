const express = require("express")
const app = express()
const router = app.router
const calController = require("../controllers/experience.controller")
const checkToken = require("../middleware/check_token").checkToken

    router.post("/create", checkToken, calController.createEvent)
    router.get("/get-mine", checkToken, calController.getMyExperiences)
    router.post("/add-user", checkToken, calController.addUserToExperience)

module.exports = router;

