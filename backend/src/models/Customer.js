const connection = require("../config/database");
const generate = require("../utils/generate");

const getIDCustomer = async (fullName, phone, address, email, callback) => {
  connection.query(
    `SELECT id_customer FROM customers WHERE full_name = ? AND phone = ? AND address = ? AND email = ?`,
    [fullName, phone, address, email],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};
const getCustomer = (fullName, phone, callback) => {
  // Đảm bảo rằng name và phone đều là chuỗi
  const fullNameStr = String(fullName);
  const phoneStr = String(phone);

  connection.query(
    `SELECT * FROM customers WHERE full_name = ? AND phone = ?`,
    [fullNameStr, phoneStr],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const createPaymentReceipt = (
  id_customer,
  payment_date,
  amount_received,
  callback
) => {
  const id_payment_receipt = generate.generateIDPaymentReceipt(); // Create id for payment receipt

  connection.query(
    `INSERT INTO payment_receipts (id_payment_receipt, id_customer, payment_date, amount_received) VALUES (?, ?, ?, ?)`,
    [id_payment_receipt, id_customer, payment_date, amount_received],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const getCustomerDebtAndLatestInvoice = (id_customer, callback) => {
  connection.query(
    `SELECT 
          debt.final_debt, 
          SUM(id.unit_price*id.quantity) AS total_invoice_amount
      FROM customers c
      LEFT JOIN debt_reports_details debt ON debt.id_customer = c.id_customer
      LEFT JOIN invoices i ON i.id_customer = c.id_customer
      LEFT JOIN invoices_details id ON id.id_invoice = i.id_invoice
      WHERE c.id_customer = ?
      GROUP BY debt.final_debt, id.id_invoice`,
    [id_customer, id_customer],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results[0]);
    }
  );
};

// const getCustomerDebt = (id_customer, callback) => {
//     connection.query(`SELECT debt FROM customers WHERE id_customer = ?`, [id_customer], (error, results) => {
//         if (error) {
//             return callback(error, null);
//         }
//         console.log("Customer debt: ", results);
//         callback(null, results);
//     });
// };

const getPaymentReceipt = (callback) => {
  const query = `SELECT * FROM payment_receipts`;

  connection.query(query, (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
};

const addCustomer = (fullName, address, phone, email, callback) => {
  connection.query(
    `INSERT INTO customers (full_name, address, phone, email, debt) VALUES (?, ?, ?, ?, 0)`,
    [fullName, address, phone, email],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      connection.query(
        `SELECT * FROM customers WHERE id_customer = ?`,
        [results.insertId],
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

const paymentInvoice = (id_customer, books, callback) => {
  // Kiểm tra ID hóa đơn trước đó
  connection.query(
    `SELECT id_invoice FROM invoices ORDER BY id_invoice DESC LIMIT 1`,
    (error, results) => {
      if (error) {
        return callback(
          { statusCode: 500, message: "Lỗi khi kiểm tra ID hóa đơn trước đó" },
          null
        );
      }

      // Tạo ID hóa đơn mới
      let newInvoiceId = "INV001";
      if (results.length > 0) {
        const lastInvoiceId = results[0].id_invoice;
        const lastIdNumber = parseInt(lastInvoiceId.replace("INV", ""), 10);
        const newIdNumber = lastIdNumber + 1;
        newInvoiceId = `INV${String(newIdNumber).padStart(3, "0")}`;
      }

      // Tạo hóa đơn mới
      connection.query(
        `INSERT INTO invoices (id_invoice, id_customer, invoices_date) VALUES (?, ?, NOW())`,
        [newInvoiceId, id_customer],
        (error, results) => {
          if (error) {
            return callback(
              { statusCode: 500, message: "Lỗi khi tạo hóa đơn" },
              null
            );
          }

          const invoiceItems = books.map((book) => [
            newInvoiceId,
            book.title,
            book.author,
            book.category,
            book.quantity,
            book.price,
            null,
          ]);

          const promises = invoiceItems.map(
            (item, index) =>
              new Promise((resolve, reject) => {
                connection.query(
                  `SELECT id_book FROM books WHERE title = ? AND author = ? AND category = ?`,
                  [item[1], item[2], item[3]],
                  (error, results) => {
                    if (error) {
                      return reject(error);
                    }
                    item[6] = results[0].id_book;
                    resolve();
                  }
                );
              })
          );

          Promise.all(promises)
            .then(() => {
              const invoiceDetailsValues = invoiceItems.map((item) => [
                item[0], // id_invoice
                item[6], // id_book
                item[4], // quantity
                item[5], // unit_price
              ]);

              const insertQuery = `INSERT INTO invoices_details (id_invoice, id_book, quantity, unit_price) VALUES ?`;

              connection.query(
                insertQuery,
                [invoiceDetailsValues],
                (error, results) => {
                  if (error) {
                    return callback(
                      {
                        statusCode: 500,
                        message: "Lỗi khi thêm sách vào hóa đơn",
                      },
                      null
                    );
                  }

                  callback(null, {
                    message:
                      "Hóa đơn và chi tiết hóa đơn đã được tạo thành công",
                  });
                }
              );
            })
            .catch((error) => {
              console.error("Error fetching id_book:", error);
              callback(
                { statusCode: 500, message: "Lỗi khi truy xuất id_book" },
                null
              );
            });
        }
      );
    }
  );
};

const updateBookQuantities = (books, callback) => {
  const promises = books.map(
    (book) =>
      new Promise((resolve, reject) => {
        connection.query(
          `UPDATE books SET quantity = quantity - ? WHERE id_book = ?`,
          [book.quantity, book.id],
          (err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          }
        );
      })
  );

  Promise.all(promises)
    .then(() => {
      callback(null);
    })
    .catch((err) => {
      callback(err);
    });
};

const updateDebt = (id_customer, books, callback) => {
  const total = books.reduce(
    (sum, book) => sum + book.quantity * book.price,
    0
  );
  console.log(books);
  connection.query(
    `UPDATE customers SET debt = debt + ? WHERE id_customer = ?`,
    [total, id_customer],
    (err) => {
      if (err) {
        return callback(err);
      }
      connection.query(
        `SELECT debt FROM customers WHERE id_customer = ?`,
        [id_customer],
        (err, selectResult) => {
          if (err) {
            return callback(err);
          }
          selectResult = Number(selectResult[0].debt);
          console.log(selectResult);
          callback(null, selectResult);
        }
      );
    }
  );
};

// const updateCustomerDebt = (id_customer, amount_paid, callback) => {
//     const updateDebtQuery = `
//     UPDATE customers
//     SET debt = debt + ?
//     WHERE id_customer = ?
//     `;
//     connection.query(updateDebtQuery, [amount_paid, id_customer], (err, updateDebtResult) => {
//         if (err) {
//             return callback({ statusCode: 500, message: "Lỗi khi cập nhật nợ khách hàng" }, null);
//         }
//         console.log("Updated debt:", updateDebtResult);
//         callback(null, { updateDebtResult });
//     });
// };

module.exports = {
  getIDCustomer,
  createPaymentReceipt,
  getPaymentReceipt,
  addCustomer,
  paymentInvoice,
  updateBookQuantities,
  getCustomer,
  updateDebt,
  getCustomerDebtAndLatestInvoice,
};
