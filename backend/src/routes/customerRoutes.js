const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post("/payment", customerController.createPaymentReceipt);

router.get("/payment-receipt", customerController.getPaymentReceipt);

router.post("/get-invoice-and-debt", customerController.getCustomerDebtAndLatestInvoice);

router.post("/pay-invoice", customerController.createPaymentInvoice);

router.post("/pay-debt", customerController.createPaymentDebt);
router.get("/get-customer", customerController.getCustomer);
module.exports = router;
