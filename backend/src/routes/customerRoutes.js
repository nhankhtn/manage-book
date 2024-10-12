const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/report/debt", customerController.reportDebt);

module.exports = router;
