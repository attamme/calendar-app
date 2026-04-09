const express = require("express");

const router = express.Router();
const calController = require("../controllers/experience.controller");
const { checkToken } = require("../middleware/check_token");

router.post("/create", checkToken, calController.createEvent);
router.get("/get-mine", checkToken, calController.getMyExperiences);
router.post("/add-user", checkToken, calController.addUserToExperience);

module.exports = router;
