const express = require("express");

const itemController = require("../controllers/items.controller");
const { checkToken } = require("../middleware/check_token");

const router = express.Router();

router.get("/dashboard", checkToken, itemController.dashboard);
router.get("/", checkToken, itemController.listItems);
router.get("/:id", checkToken, itemController.getItem);
router.post("/", checkToken, itemController.createItem);
router.patch("/:id", checkToken, itemController.updateItem);
router.post("/:id/share", checkToken, itemController.shareItem);

module.exports = router;
