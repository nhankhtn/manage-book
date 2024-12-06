const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post("/payment", customerController.createPaymentReceipt);

router.get("/payment-receipt", customerController.getPaymentReceipt);

router.post("/get-invoice-and-debt", customerController.getCustomerDebtAndLatestInvoice);

module.exports = router;
