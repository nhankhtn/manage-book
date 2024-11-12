const connection = require("../config/database");
const { generateSlug } = require("../utils/generate");
/*
getBook({
title: "abc"
}, callback)
*/
// comparison: exact or like
const getBooks = (params = {}, callback, options = { comparison: "exact" }) => {
  let query = `SELECT title, author, category, quantity, price FROM books WHERE 1=1 `;
  const entries = [];
  if (Object.keys(params).length > 0) {
    Object.entries(params).forEach(([key, value]) => {
      if (options.comparison === "exact") {
        query += ` AND ?? = ?`;
        entries.push(key, value);
      } else {
        query += ` AND ?? LIKE ?`;
        entries.push(key, `%${value}%`);
      }
    });
  }

  connection.query(query, entries, (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
};

const addBook = ({ title, category, author, quantity, price }, callback) => {
  const slug = generateSlug(title);
  connection.query(
    "INSERT INTO books (title, category, author, quantity, slug, price) VALUES (?, ?, ?, ?,?, ?)",
    [title, category, author, quantity, slug, price],

    (error, result) => {
      if (error) {
        return callback(error, null);
      }
      // Retrieve the newly inserted book using its ID
      connection.query(
        `SELECT * FROM books WHERE id_book = ?`,
        [result.insertId],
        (selectError, selectResult) => {
          if (selectError) {
            return callback(selectError, null);
          }

          // Return the newly inserted book
          callback(null, selectResult[0]);
        }
      );
    }
  );
};
/*
updateBook({
    slug: "abc"
}, {
quantity: 100
}, callback)
*/
const updateBook = ({ slug }, { quantity }, callback) => {
  connection.query(
    `UPDATE books
         SET quantity = COALESCE(quantity, 0) + ?
         WHERE slug = ?
`,
    [quantity, slug],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      connection.query(
        `SELECT * FROM books WHERE slug = ?`,
        [slug],
        (selectError, selectResult) => {
          if (selectError) {
            return callback(selectError, null);
          }

          callback(null, selectResult[0]);
        }
      );
    }
  );
};

const getStock = (month, year, callback) => {
  connection.query(
    `SELECT b.title, b.author, srd.initial_stock, srd.changes, srd.final_stock
         FROM stock_reports sr
         INNER JOIN stock_reports_details srd ON sr.id_stock_report = srd.id_stock_report
         INNER JOIN books b on srd.id_book = b.id_book 
         WHERE MONTH(sr.report_date) = ? AND YEAR(sr.report_date) = ?`,
    [month, year],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const deleteBook = ({ slug }, callback) => {
  connection.query(
    `DELETE FROM books WHERE slug = ?`,
    [slug],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const getBookId = (data, callback) => {
  connection.query(
    `SELECT id_book FROM books WHERE title = ? AND author = ? AND category = ? AND price = ?`,
    [data.title, data.author, data.category, data.price],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results[0]);
    }
  );
};

module.exports = {
  getBooks,
  addBook,
  updateBook,
  getStock,
  deleteBook,
  getBookId,
};
