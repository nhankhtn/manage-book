const Book = require('../models/BookModel');

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
        id : req.body.id,
        title : req.body.title,
        genre : req.body.genre,
        author : req.body.author,
        quantity : req.body.quantity
    };
    Book.addBook(newBook, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add book' });
        }
        res.status(201).json({ message: 'Book added successfully', id: result.insertId });
    });
};

const importBooks = (req, res) => {
    const title = req.body.title;
    const genre = req.body.genre;
    const author = req.body.author;
    const quantity = req.body.quantity;
    if (quantity < 150) {
        return res.status(400).json({ error: 'Số lượng nhập phải ít nhất là 150' });
    }
    Book.checkStock(title, (err, book) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi kiểm tra số lượng tồn' });
        }

        if (!book) {
            return res.status(200).json({ message: 'Sách không tồn tại' });
        }
        const currentStock = book.so_luong;
        console.log(currentStock);
        Book.updateStock(title, quantity, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({ message: 'Nhập sách thành công', newStock: currentStock + quantity});
        });
    });
};


module.exports = {
    getBooks,
    getBook,
    createBook,
    importBooks
};
