const express = require("express");

const calendarController = require("../controllers/calendars.controller");
const { checkToken } = require("../middleware/check_token");

const router = express.Router();

router.get("/", checkToken, calendarController.listCalendars);
router.post("/", checkToken, calendarController.createCalendar);
router.post("/create", checkToken, calendarController.createCalendar);
router.patch("/:id", checkToken, calendarController.updateCalendar);
router.post("/:id/share", checkToken, calendarController.shareCalendar);
router.post("/add-friend", checkToken, calendarController.shareCalendarLegacy);

module.exports = router;
