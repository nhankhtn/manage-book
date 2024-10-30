const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/report/debt", customerController.reportDebt);

router.post("/payment", customerController.createPaymentReceipt);

router.get("/get-payment-receipt", customerController.getPaymentReceipt);

module.exports = router;
