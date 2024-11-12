const connection = require("../config/database");
const Customer = require("../models/Customer");
const Books = require("../models/Book");

const createPaymentReceipt = (data, callback) => {
  const { fullName, phone, address, email, payment_date, amount_received } =
    data;

  // Retrieve the ID of the customer from the data
  Customer.getIDCustomer(fullName, phone, address, email, (err, results) => {
    if (err) {
      return callback(
        { statusCode: 500, message: "Lỗi khi tìm khách hàng" },
        null
      );
    } else {
      const id_customer = results[0].id_customer;

      // Create a payment receipt (Has to be nested inside the getIDCustomer callback to ensure id_customer is retrieved first)
      Customer.createPaymentReceipt(
        id_customer,
        payment_date,
        amount_received,
        (err, results) => {
          if (err) {
            return callback(
              { statusCode: 500, message: "Lỗi khi tạo phiếu thu" },
              null
            );
          }
          callback(null, results);
        }
      );
    }
  });
};
const createPaymentInvoice = (data, callback) => {
  const { fullName, address, phone, email, books } = data;
  Customer.getIDCustomer1(fullName, phone, (err, results) => {
    if (err) {
      return callback(
        { statusCode: 500, message: "Lỗi khi tìm khách hàng" },
        null
      );
    }
    const isInvoice = "invoice";

    if (results.length === 0) {
      Customer.addCustomer(
        fullName,
        address,
        phone,
        email,
        (addErr, newCustomer) => {
          if (addErr) {
            return callback(
              { statusCode: 500, message: "Lỗi khi thêm khách hàng" },
              null
            );
          }
          const id_customer = newCustomer.id_customer;
          createAndProcess(id_customer, books, isInvoice, callback);
        }
      );
    } else {
      const id_customer = results[0].id_customer;
      createAndProcess(id_customer, books, isInvoice, callback);
    }
  });
};

const createPaymentDebt = (data, callback) => {
  const { fullName, address, phone, email, books } = data;
  Customer.getIDCustomer1(fullName, phone, (err, results) => {
    if (err) {
      return callback(
        { statusCode: 500, message: "Lỗi khi tìm khách hàng" },
        null
      );
    }
    const isDebt = "debt";

    if (results.length === 0) {
      Customer.addCustomer(
        fullName,
        address,
        phone,
        email,
        (addErr, newCustomer) => {
          if (addErr) {
            return callback(
              { statusCode: 500, message: "Lỗi khi thêm khách hàng" },
              null
            );
          }
          const id_customer = newCustomer.id_customer;
          createAndProcess(id_customer, books, isDebt, callback);
        }
      );
    } else {
      const id_customer = results[0].id_customer;
      createAndProcess(id_customer, books, isDebt, callback);
    }
  });
};

const createAndProcess = (id_customer, books, which, callback) => {
  updateBooksData(books);
  Customer.paymentInvoice(id_customer, books, (err, results) => {
    if (err) {
      console.log(err);
      return callback(
        { statusCode: 500, message: "Lỗi khi tạo hóa đơn" },
        null
      );
    }
    if (which === "invoice") {
      Customer.updateBookQuantities(books, (updateErr) => {
        if (updateErr) {
          console.log(updateErr);
          return callback(
            { statusCode: 500, message: "Lỗi khi cập nhật số lượng sách" },
            null
          );
        }
        const totalAmount = books.reduce(
          (sum, book) => sum + book.quantity * book.price,
          0
        );
        callback(null, {
          message: `Hóa đơn đã được tạo thành công. Tổng số tiền thanh toán là: ${totalAmount}`,
        });
      });
    }
    if (which === "debt") {
      Customer.updateBookQuantities(books, (updateErr) => {
        if (updateErr) {
          console.log(updateErr);
          return callback(
            { statusCode: 500, message: "Lỗi khi cập nhật số lượng sách" },
            null
          );
        }
      });
      Customer.updateDebt(id_customer, books, (updateErr, results) => {
        if (updateErr) {
          console.log(updateErr);
          return callback(
            { statusCode: 500, message: "Lỗi khi cập nhật số tiền nợ" },
            null
          );
        }
        callback(null, {
          message: `Hóa đơn đã được tạo thành công. Số tiền nợ hiện tại là: ${results}`,
        });
      });
    }
  });
};

async function updateBooksData(books) {
  for (const book of books) {
    try {
      const id_book = await new Promise((resolve, reject) => {
        Books.getBookId(book, (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      });
      book.id = id_book.id_book;
    } catch (err) {
      console.error(err);
    }
  }
}
module.exports = {
  createPaymentReceipt,
  createPaymentInvoice,
  createPaymentDebt,
};
