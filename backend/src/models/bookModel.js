const connection = require('../config/connection');


const getAllBooks = (callback) => {
    connection.query('SELECT * FROM sach', (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};


const getBookById = (id, callback) => {
    connection.query('SELECT * FROM sach WHERE id_sach = ?', [id], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0]);
    });
};


const addBook = (book, callback) => {
    const { title, author, price, stock } = book;
    connection.query('INSERT INTO sach (ID_SACH, TEN_SACH, THE_LOAI, TAC_GIA, SO_LUONG) VALUES (?, ?, ?, ?, ?)',
        [title, author, price, stock],
        (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        }
    );
};


const checkStock = (title, callback) => {
    connection.query('SELECT so_luong FROM sach WHERE ten_sach = ?', [title], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0]);
    });
};


const updateStock = (title, quantity, callback) => {
    connection.query('UPDATE sach SET so_luong = so_luong + ? WHERE ten_sach = ?', [quantity, title], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const getID = (title, callback) => {
    connection.query('SELECT id_sach FROM sach WHERE ten_sach = ?', [title], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0]);
    });
};


module.exports = {
    getAllBooks,
    getBookById,
    addBook,
    checkStock,
    updateStock
};
