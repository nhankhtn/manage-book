const connection = require("../config/database");
const generate = require("../utils/generate");
const { generateSlug } = require("../utils/generate");

const getCustomer = (data, callback) => {
  const { fullName, phone, address, email } = data;
  const fullNameStr = fullName?.toString().trim();
  const phoneStr = phone?.toString().trim();
  let queryStr = `SELECT * FROM customers WHERE full_name = ? AND phone = ?`;
  const queryParams = [fullNameStr, phoneStr];

  if (address) {
    queryStr += ` AND address = ?`;
    queryParams.push(address.toString().trim());
  }
  if (email) {
    queryStr += ` AND email = ?`;
    queryParams.push(email.toString().trim());
  }
  connection.query(queryStr, queryParams, (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
};

const createPaymentReceipt = (
  id_customer,
  payment_date,
  amount_received,
  callback
) => {
  const id_payment_receipt = generate.generateID(); // Create id for payment receipt

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
const paymentInvoice = (id_customer, books, which, callback) => {
  const promises = books.map((book) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT id_book FROM books WHERE title = ? AND author = ? AND category = ?`,
        [book.title, book.author, book.category],
        (error, results) => {
          if (error || results.length === 0) {
            return reject(
              error || { message: "Không tìm thấy sách tương ứng" }
            );
          }
          book.id_book = results[0].id_book;
          resolve();
        }
      );
    });
  });

  Promise.all(promises)
    .then(() => {
      updateBookQuantities(books, (error) => {
        if (error) {
          return callback(
            { statusCode: 422, message: "Lỗi khi cập nhật số lượng sách" },
            null
          );
        }
        callback(null, { message: "Cập nhật thành công" });
      });
    })
    .catch((error) => {
      callback(
        {
          statusCode: 422,
          message: error.message || "Lỗi khi lấy ID sách",
        },
        null
      );
    });

  connection.query(
    `SELECT id_invoice FROM invoices ORDER BY id_invoice DESC LIMIT 1`,
    (error, results) => {
      if (error) {
        return callback(
          { statusCode: 500, message: "Lỗi khi kiểm tra ID hóa đơn trước đó" },
          null
        );
      }

      let newInvoiceId = "INV001";
      if (results.length > 0) {
        const lastInvoiceId = results[0].id_invoice;
        const lastIdNumber = parseInt(lastInvoiceId.replace("INV", ""), 10);
        const newIdNumber = lastIdNumber + 1;
        newInvoiceId = `INV${String(newIdNumber).padStart(3, "0")}`;
      }

      connection.query(
        `INSERT INTO invoices (id_invoice, id_customer, invoices_date) VALUES (?, ?, NOW())`,
        [newInvoiceId, id_customer],
        (error) => {
          if (error) {
            return callback(
              { statusCode: 422, message: "Lỗi khi tạo hóa đơn" },
              null
            );
          }

          Promise.all(promises)
            .then(() => {
              const invoiceDetailsValues = books.map((book) => [
                newInvoiceId,
                book.id_book,
                book.quantity,
                book.price,
              ]);

              connection.query(
                `INSERT INTO invoices_details (id_invoice, id_book, quantity, unit_price) VALUES ?`,
                [invoiceDetailsValues],
                (error) => {
                  if (error) {
                    return callback(
                      {
                        statusCode: 500,
                        message: "Lỗi khi thêm sách vào hóa đơn",
                      },
                      null
                    );
                  }

                  if (which === "debt") {
                    const total = books.reduce(
                      (sum, book) => sum + book.quantity * book.price,
                      0
                    );

                    connection.query(
                      `UPDATE customers SET debt = debt + ? WHERE id_customer = ?`,
                      [total, id_customer],
                      (err) => {
                        if (err) {
                          return callback(
                            {
                              statusCode: 500,
                              message: "Lỗi khi cập nhật số tiền nợ",
                            },
                            null
                          );
                        }

                        connection.query(
                          `SELECT debt FROM customers WHERE id_customer = ?`,
                          [id_customer],
                          (err, selectResult) => {
                            if (err) {
                              return callback(err);
                            }

                            const currentDebt = selectResult[0].debt;
                            callback(null, { currentDebt });
                          }
                        );
                      }
                    );
                  } else {
                    const totalAmount = books.reduce(
                      (sum, book) => sum + book.quantity * book.price,
                      0
                    );

                    createPaymentReceipt(
                      id_customer,
                      new Date(),
                      totalAmount,
                      (error) => {
                        if (error) {
                          return callback(
                            {
                              statusCode: 500,
                              message: "Lỗi khi tạo phiếu thanh toán",
                            },
                            null
                          );
                        }
                        callback(null, { totalAmount });
                      }
                    );
                  }
                }
              );
            })
            .catch((error) => {
              callback(
                { statusCode: 500, message: "Lỗi khi xử lý chi tiết hóa đơn" },
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
        console.log(book.id_book);
        connection.query(
          `UPDATE books SET quantity = quantity - ? WHERE id_book = ?`,
          [book.quantity, book.id_book],
          (err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          }
        );
      })
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
  createPaymentReceipt,
  getPaymentReceipt,
  addCustomer,
  paymentInvoice,
  getCustomer,
  getCustomerDebtAndLatestInvoice,
};
