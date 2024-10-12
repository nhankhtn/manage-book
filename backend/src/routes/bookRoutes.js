const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// importBooks
router.put("/update", bookController.updateBook);

// reportStock
router.get("/stocks/report", bookController.reportStock);

// searchBooks
router.get("/search", bookController.searchBooks);

// totalPrice
router.get("/total/price", bookController.totalPrice);

module.exports = router;
