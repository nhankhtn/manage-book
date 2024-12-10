const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/debt", reportController.getDebtReport);

router.get("/all-debt", reportController.getAllDebtReport);

router.get("/stock", reportController.getStockReport);

router.get("/all-stock", reportController.getAllStockReport);

module.exports = router;
