const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/debt", reportController.getDebtReport);

router.get("/all-debt", reportController.getAllDebtReport);

module.exports = router;