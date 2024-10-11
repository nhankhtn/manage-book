const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// importBooks
router.put("/add", bookController.importBooks);

// reportStock
router.get("/stocks", bookController.reportStock);

// searchBooks
router.get("/search", bookController.searchBooks);

// totalPrice
router.get("/total", bookController.totalPrice);

module.exports = router;
