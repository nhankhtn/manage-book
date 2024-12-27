const bookService = require("../services/bookService");
const Book = require("../models/Book");

const getBooks = (req, res) => {
  Book.getBooks((err, books) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve books" });
    }
    res.json({ data: books });
  });
};

const totalPrice = (req, res) => {
  const books = req.body;
  let totalAmount = 0;
  let processedBooks = [];
  const processBook = (index) => {
    if (index >= books.length) {
      return res.json({ books: processedBooks, total: totalAmount });
    }

    const { title, author, category, quantity, price, needbuying } =
      books[index];
    bookService.totalPrice(
      { title, author, category, quantity, price, needbuying },
      (err, book) => {
        if (err) {
          return res.status(500).json({ error: "Lỗi khi tìm sách" });
        }
        if (!book) {
          res.status(404).json({ message: `Không tìm thấy dữ liệu phù hợp:` });
        }

        totalAmount += book.price * needbuying;
        processedBooks.push({ title, author, category, needbuying, price });
        processBook(index + 1);
      }
    );
  };
  processBook(0);
};

const updateBooks = async (req, res) => {
  const books = req.body;
  let resultAdd = [];
  let failedBooks = [];
  try {
    resultAdd = await Promise.allSettled(
      books.map((book) => {
        return new Promise((resolve, reject) => {
          bookService.updateBook(book, (err, result) => {
            if (err) {
              failedBooks.push(book);
              return reject(err);
            }
            resolve(result.book);
          });
        });
      })
    );
   // console.log(resultAdd);
    res.status(200).json({ message: resultAdd });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi khi cập nhật sách",
      failedBooks,
    });
  }
};

// REPORT STOCK
const reportStock = (req, res) => {
  const { month, year } = req.query;
 // console.log(month, year);
  Book.getStock(month, year, (err, book) => {
    if (!book) {
      return res.status(404).json({ message: "Tháng này không có lượng tồn" });
    }
    res.json(book);
  });
};

// LOOKUP BOOK
const searchBooks = (req, res) => {
  const { title, author, category, price } = req.query;

  bookService.search({ title, author, category, price }, (err, books) => {
    if (err) return res.status(500).json({ message: "Lỗi khi tìm sách" });
    if (!books.length) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json({ data: books });
  });
};

// get available books
const getAvailableBooks = (req, res) => {
  Book.getAvailableBooks((err, books) => {
    if (err) return res.status(500).json({ message: "Lỗi khi tìm sách" });
    res.json(books);
  });
};
// Không cần sử dụng
const deleteBooks = (req, res) => {
  const { slug } = req.query;
  bookService.deleteBook({ slug }, (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi khi xóa sách" });
    res.json(result);
  });
};


module.exports = {
  getBooks,
  updateBooks,
  reportStock,
  searchBooks,
  totalPrice,
  getAvailableBooks,
};
