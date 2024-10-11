const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/rpdebt", customerController.reportDebt);

module.exports = router;