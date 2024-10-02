const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// getAllBooks
router.get("/", bookController.getBooks);

// getBookById
router.get("/:id", bookController.getBook);

// addBook
router.post("/", bookController.createBook);

// importBooks
router.post("/import", bookController.importBooks);

module.exports = router;
