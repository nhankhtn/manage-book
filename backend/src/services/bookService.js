const connection = require('../config/database');


// DESKTOP 5 và 6

// Get all books
const getAllBooks = (callback) => {
    connection.query('SELECT book_title, author, category, quantity, price FROM book', (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};


// total price
const total = (title, author, category, quantity, price, needbuying, callback) => {
    connection.query(
        `SELECT book_title, author, category, quantity, price
         FROM book
         WHERE book_title = ? AND author = ? AND category = ? AND quantity = ? AND price = ?`,
        [title, author, category, quantity, price], 
        (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length > 0) {
                connection.query(
                    `UPDATE book
                     SET quantity = quantity - ?, price = COALESCE(price, 0)
                     WHERE book_title = ? AND author = ? AND category = ? AND price = ?`,
                    [needbuying, title, author, category, price],
                    (updateError) => {
                        if (updateError) {
                            return callback(updateError, null);
                        }
                        const resultWithNeedBuying = {
                            ...results[0],
                            needbuying: needbuying
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




const addBook = (book, callback) => {
    const { title,category, author, quantity, price} = book;
    connection.query('INSERT INTO book (BOOK_TITLE, CATEGORY, AUTHOR, QUANTITY,PRICE) VALUES (?, ?, ?, ?, ?)',
        [title, category, author, quantity, price],
        (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        }
    );
};


const checkStock = (title, callback) => {
    connection.query('SELECT quantity FROM book WHERE book_title = ?', [title], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0]);
    });
};


const updateStock = (title, quantity, callback) => {
    connection.query(
        `UPDATE book
         SET quantity = COALESCE(quantity, 0) + ?
         WHERE book_title = ?
`, [quantity, title], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};



// Stock in mm/yyyy
const getStock = (month, year, callback) => {
    connection.query(
        `SELECT b.BOOK_TITLE, b.author, srd.INITIAL_STOCK, srd.CHANGES, srd.FINAL_STOCK
         FROM STOCK_REPORT sr
         INNER JOIN STOCK_REPORT_DETAILS srd ON sr.ID_STOCK_REPORT = srd.ID_STOCK_REPORT
         INNER JOIN BOOK b on srd.ID_BOOK = b.ID_BOOK 
         WHERE MONTH(sr.REPORT_DATE) = ? AND YEAR(sr.REPORT_DATE) = ?`,
        [month, year], (error, results) => {
        if (error) {

            return callback(error, null);
        }
        callback(null, results);
    });
};


// search book
const search = (title, author, category, price, callback) => {
    let query = 'SELECT book_title, author, category, quantity, price FROM book WHERE 1=1';
    const queryParams = [];

    if (title) {
        query += ' AND book_title = ?';
        queryParams.push(title);
    }
    if (author) {
        query += ' AND author = ?';
        queryParams.push(author);
    }
    if (category) {
        query += ' AND category = ?';
        queryParams.push(category);
    }
    if (price) {
        query += ' AND price = ?';
        queryParams.push(price);
    }

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
}



module.exports = {
    getAllBooks,
    addBook,
    checkStock,
    updateStock,
    getStock,
    search,
    total
};