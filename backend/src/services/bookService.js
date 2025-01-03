const connection = require("../config/database");
const Book = require("../models/Book");
const { generateSlug } = require("../utils/generate");
const log = require("../utils/log");

// DESKTOP 5 và 6

const updateBook = (bookData, callback) => {
  const { title, author, category, price, quantity } = bookData;
  const slug = generateSlug(title+" "+category+" "+author);
  //console.log("slug:",slug);
  Book.getBooks({ slug }, (err, books) => {
    if (err) {
      return callback({ message: "Lỗi khi tìm sách" }, null);
    }
    if (books.length == 0) {
      if (!author || !category || !price || !quantity) {
        return callback(
          { message: "Sách không tồn tại. Vui lòng nhập đầy đủ thông tin." },
          null
        );
      }

      Book.addBook(bookData, (err, book) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, { message: "Nhập sách thành công", book });
      });
    } else {
      Book.updateBook({ slug }, { quantity }, (err, book) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, { message: "Cập nhật thành công", book });
      });
    }
  });
};

// total price
const totalPrice = (
  { title, author, category, quantity, price, needbuying },
  callback
) => {
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
              needbuying,
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
const search = ({ title, author, category, price }, callback) => {
  //const slug = generateSlug(title);
  //console.log("skug",slug);
  const params = {};
  // if (slug !== undefined) {
  //   params.slug = slug;
  // }
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

  Book.getBooks(
    params,
    (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    },
    { comparison: "like" }
  );
};

module.exports = {
  updateBook,
  search,
  totalPrice,
};
