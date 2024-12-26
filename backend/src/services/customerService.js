const connection = require("../config/database");
const Customer = require("../models/Customer");
const Books = require("../models/Book");

const createPaymentReceipt = (data, callback) => {
  const { fullName, phone, address, email, payment_date, amount_received } =
    data;

  // Retrieve the ID of the customer from the data
  Customer.getCustomer({fullName, phone}, (err, results) => {
    if (err) {
      return callback(
        { statusCode: 500, message: "Lỗi khi tìm khách hàng" },
        null
      );
    } else {
      if (results.length === 0) {
        return callback(
          { statusCode: 404, message: "Không tìm thấy khách hàng" },
          null
        );
      }
      const id_customer = results[0].id_customer;
      // Update the customer's email and address if they changed
      Customer.updateCustomer(id_customer,{ email, address }, (err, results) => {
        if (err) {
          return callback(
            { statusCode: 500, message: "Lỗi khi cập nhật thông tin khách hàng" },
            null
          );
        }
      });
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

const getCustomerDebtAndLatestInvoice = (data, callback) => {
  const { full_name, phone, address, email } = data;

  Customer.getCustomer(data, (err, results) => {
    if (err) {
      return callback(
        { statusCode: 500, message: "Lỗi khi tìm khách hàng" },
        null
      );
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy khách hàng" });
    }

    const id_customer = results[0].id_customer;

    Customer.getCustomerDebtAndLatestInvoice(id_customer, (err, data) => {
      if (err) {
        return callback(
          {
            statusCode: 500,
            message: "Lỗi khi lấy thông tin công hóa đơn và nợ",
          },
          null
        );
      }
      callback(null, data);
    });
  });
};

const createPaymentInvoice = (data, callback) => {
  const { fullName, address, phone, email, books } = data;
  Customer.getCustomer({fullName, phone}, (err, results) => {
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
       // Update the customer's email and address if they changed
       Customer.updateCustomer(id_customer,{ email, address }, (err, results) => {
        if (err) {
          return callback(
            { statusCode: 500, message: "Lỗi khi cập nhật thông tin khách hàng" },
            null
          );
        }
      });
      createAndProcess(id_customer, books, isInvoice, callback);
    }
  });
};

const createPaymentDebt = (data, callback) => {
  const { fullName, address, phone, email, books } = data;
  Customer.getCustomer({fullName, phone}, (err, results) => {
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
       // Update the customer's email and address if they changed
       Customer.updateCustomer(id_customer,{ email, address }, (err, results) => {
        if (err) {
          return callback(
            { statusCode: 500, message: "Lỗi khi cập nhật thông tin khách hàng" },
            null
          );
        }
      });
      createAndProcess(id_customer, books, isDebt, callback);
    }
  });
};

const createAndProcess = (id_customer, books, which, callback) => {
  Customer.paymentInvoice(id_customer, books, which, (err, result) => {
    if (err) {
      console.log(err);
      return callback(
        { statusCode: 500, message: "Lỗi trong quá trình tạo hóa đơn" },
        null
      );
    }

    const responseMessage =
      which === "invoice"
        ? `Hóa đơn đã được tạo thành công. Tổng số tiền thanh toán là: ${result.totalAmount}`
        : `Hóa đơn đã được tạo thành công. Số tiền nợ hiện tại là: ${result.debt}`;

    callback(null, { message: responseMessage });
  });
};
module.exports = {
  createPaymentReceipt,
  createPaymentInvoice,
  createPaymentDebt,
  getCustomerDebtAndLatestInvoice,
};
