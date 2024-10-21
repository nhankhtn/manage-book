const connection = require('../config/database');

/*
getBook({
title: "abc"
}, callback)
*/
const getBooks = (params = {}, callback) => {
    let query = `SELECT title, author, category, quantity, price FROM books WHERE 1=1 `;
    // const entries = Object.entries(params).flat();
    const entries = [];
    if (Object.keys(params).length > 0) {
        Object.entries(params).forEach(([key, value]) => {
            // query += ` AND ?? = ?`;
            query += ` AND ?? LIKE ?`;
            entries.push(key, `%${value}%`);
        });
    }

    connection.query(query, entries, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
}
const addBook = ({ title, category, author, quantity, price }, callback) => {
    connection.query('INSERT INTO books (title, category, author, quantity,price) VALUES (?, ?, ?, ?, ?)',
        [title, category, author, quantity, price],

        (error, result) => {
            if (error) {
                return callback(error, null);
            }
          //  callback(null, result);
                  // Retrieve the newly inserted book using its ID
            const selectQuery = `SELECT * FROM books WHERE id_book = ?`;
            const selectValues = [result.insertId];

            connection.query(selectQuery, selectValues, (selectError, selectResult) => {
                if (selectError) {
                    return callback(selectError, null);
                }

                // Return the newly inserted book
                callback(null, selectResult[0]);
            });
            }
    );
}
/*
updateBook({
    title: "abc"
}, {
quantity: 100
}, callback)
*/
const updateBook = ({ title }, { quantity }, callback) => {
    connection.query(
        `UPDATE books
         SET quantity = COALESCE(quantity, 0) + ?
         WHERE title = ?
`, [quantity, title], (error, results) => {
        if (error) {
            return callback(error, null);
        }
      //  callback(null, results);
        // Retrieve the updated book using its title
        const selectQuery = `SELECT * FROM books WHERE title = ?`;
        const selectValues = [title];

        connection.query(selectQuery, selectValues, (selectError, selectResult) => {
            if (selectError) {
                return callback(selectError, null);
            }

            // Return the updated book
            callback(null, selectResult[0]);
        });
    });
}

const getStock = (month, year, callback) => {
    connection.query(
        `SELECT b.title, b.author, srd.initial_stock, srd.changes, srd.final_stock
         FROM stock_reports sr
         INNER JOIN stock_reports_details srd ON sr.id_stock_report = srd.id_stock_report
         INNER JOIN books b on srd.id_book = b.id_book 
         WHERE MONTH(sr.report_date) = ? AND YEAR(sr.report_date) = ?`,
        [month, year], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
};

const deleteBook = (title, callback) => {
    connection.query(
        `DELETE FROM books WHERE title = ?`, [title], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
}

module.exports = {
    getBooks,
    addBook,
    updateBook,
    getStock,
    deleteBook,
}
