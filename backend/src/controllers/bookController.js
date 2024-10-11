const Book = require('../services/bookService');

const getBooks = (req, res) => {
    Book.getAllBooks((err, books) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve books' });
        }
        res.json(books);
    });
};

const getBook = (req, res) => {
    const id = req.body.id;
    Book.getBookById(id, (err, book) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve book' });
        }
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    });
};


const createBook = (req, res) => {
    const newBook = {
        id: req.body.id,
        title: req.body.title,
        genre: req.body.genre,
        author: req.body.author,
        quantity: req.body.quantity
    };
    Book.addBook(newBook, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add book' });
        }
        res.status(201).json({ message: 'Book added successfully', id: result.insertId });
    });
};

const importBooks = (req, res) => {
    const { title, genre, author, quantity } = req.body;
    Book.checkStock(title, (err, book) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi kiểm tra số lượng tồn' });
        }
        if (!book) {
            Book.addBook(req.body, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to add book' });
                }
                return res.status(201).json({ message: 'Book added successfully', id: result.insertId });
            });
        }
        const currentStock = book.so_luong;
        Book.updateStock(title, quantity, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Nhập sách thành công', newStock: currentStock + quantity });
        });
    });
};


module.exports = {
    getBooks,
    getBook,
    createBook,
    importBooks
};
