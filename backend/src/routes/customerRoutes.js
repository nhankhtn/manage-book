const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/report/debt", customerController.reportDebt);

router.post("/payment", customerController.createPaymentReceipt);

router.get("/payment-receipt", customerController.getPaymentReceipt);

router.post("/pay-invoice", customerController.CreatePaymentInvoice);

router.post("/pay-debt", customerController.CreatePaymentDebt);

module.exports = router;
