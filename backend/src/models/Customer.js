const connection = require("../config/database");
const generate = require("../utils/generate");

const getReportDebt = (month, year, callback) => {
  connection.query(
    `SELECT c.full_name, drd.initial_debt, drd.changes, drd.final_debt
                      FROM debt_reports_details drd inner join debt_reports dr on drd.id_debt_report = dr.id_debt_report
                                                   inner join customers c on c.id_customer = drd.id_customer
                      where MONTH(dr.report_date) = ? AND YEAR(dr.report_date) = ?`,
    [month, year],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const getIDCustomer = async (full_name, phone, address, email, callback) => {
  connection.query(
    `SELECT id_customer FROM customers WHERE full_name = ? AND phone = ? AND address = ? AND email = ?`,
    [full_name, phone, address, email],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};
const getIDCustomer1 = (name, phone, callback) => {
  // Đảm bảo rằng name và phone đều là chuỗi
  const fullNameStr = String(name);
  const phoneStr = String(phone);

  connection.query(
    `SELECT * FROM CUSTOMERS WHERE full_name = ? AND phone = ?`,
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

const getPaymentReceipt = (callback) => {
  const query = `SELECT * FROM payment_receipts`;

  connection.query(query, (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
};

const addCustomer = (full_name, address, phone, email, callback) => {
  connection.query(
    `INSERT INTO CUSTOMERS (full_name, address, phone, email, debt) VALUES (?, ?, ?, ?, 0)`,
    [full_name, address, phone, email],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      connection.query(
        `SELECT * FROM CUSTOMERS WHERE id_customer = ?`,
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
    `SELECT id_invoice FROM INVOICES ORDER BY id_invoice DESC LIMIT 1`,
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
        `INSERT INTO INVOICES (id_invoice, id_customer, invoices_date) VALUES (?, ?, NOW())`,
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

              const insertQuery = `INSERT INTO INVOICES_DETAILS (id_invoice, id_book, quantity, unit_price) VALUES ?`;

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

module.exports = {
  getReportDebt,
  getIDCustomer,
  createPaymentReceipt,
  getPaymentReceipt,
  addCustomer,
  paymentInvoice,
  updateBookQuantities,
  getIDCustomer1,
  updateDebt,
};
