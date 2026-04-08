const express = require("express")
const app = express()
const router = app.router
const calController = require("../controllers/calendars.controller")
const checkToken = require("../middleware/check_token").checkToken

    router.get("/", checkToken, calController.getAll)
    router.post("/create", checkToken, calController.create)
    router.post("/add-friend", checkToken, calController.addFriend)
    router.get("/show-mine", checkToken, calController.showMyCalendars)
    router.get("/friends", calController.getFriends)
    router.post("/get-events", checkToken, calController.getEventsFromCalendar)

module.exports = router;

