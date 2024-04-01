const express = require("express");
const router = express.Router();
const feedbackController = require("../controller/feedback");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/", verifyToken, feedbackController.addFeedback);

module.exports = router;
