const connection = require('../config/database');
const Book = require("../models/Book");

// DESKTOP 5 và 6

const importBook = (bookData, callback) => {
    const { title, author, category, price, quantity } = bookData;
    Book.getBooksEqual({ title }, (err, books) => {
        if (err) {
            return callback({ statusCode: 500, message: "Lỗi khi tìm sách" }, null);
        }
        if (books.length == 0) {
            if (!author || !category || !price || !quantity) {
                return callback({ message: 'Sách không tồn tại. Vui lòng nhập đầy đủ thông tin.', statusCode: 400 }, null);
            }

            Book.addBook(bookData, (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, { message: 'Nhập sách thành công', book: result });
            });
        } else {
            const currentStock = books[0].quantity || 0;
            Book.updateBook({ title }, { quantity }, (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, { message: 'Cập nhật thành công', book: result });
            });
        }
    });
};

// total price
const total = (title, author, category, quantity, price, needbuying, callback) => {
    connection.query(
        `SELECT title, author, category, quantity, price
         FROM book
         WHERE title = ? AND author = ? AND category = ? AND quantity = ? AND price = ?`,
        [title, author, category, quantity, price],
        (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length > 0) {
                connection.query(
                    `UPDATE books
                     SET quantity = quantity - ?, price = COALESCE(price, 0)
                     WHERE title = ? AND author = ? AND category = ? AND price = ?`,
                    [needbuying, title, author, category, price],
                    (updateError) => {
                        if (updateError) {
                            return callback(updateError, null);
                        }
                        const resultWithNeedBuying = {
                            ...results[0],
                            needbuying
                        };
                        callback(null, resultWithNeedBuying);
                    }
                );
            } else {
                callback(null, null);
            }
        }
    );
};

// search book
const search = (title, author, category, price, callback) => {
    const params = {};
    if (title !== undefined) {
        params.title = title;
    }
    if (author !== undefined) {
        params.author = author;
    }
    if (category !== undefined) {
        params.category = category;
    }
    if (price !== undefined) {
        params.price = price;
    }

    Book.getBooks(params, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    })
}



module.exports = {
    importBook,
    search,
    total
};