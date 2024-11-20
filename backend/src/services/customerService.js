const connection = require('../config/database');
const Customer = require("../models/Customer");

const createPaymentReceipt = (data, callback) => {
    const { full_name, phone, address, email, payment_date, amount_received } = data;
    
    // Retrieve the ID of the customer from the data 
    Customer.getIDCustomer( full_name, phone, address, email, (err, results) => {
        if (err) {
            return callback({ statusCode: 500, message: "Lỗi khi tìm khách hàng" }, null);
        }
        else {
            const id_customer = results[0].id_customer;
            
            // Create a payment receipt (Has to be nested inside the getIDCustomer callback to ensure id_customer is retrieved first)
            Customer.createPaymentReceipt( id_customer, payment_date, amount_received, (err, results) => {
                if (err) {
                    return callback({ statusCode: 500, message: "Lỗi khi tạo phiếu thu" }, null);
                }
                callback(null, results);
            });
        }
    });
}

const getCustomerDebtAndLatestInvoice = (data, callback) => {
  const { full_name, phone, address, email } = data;

  Customer.getIDCustomer(full_name, phone, address, email, (err, results) => {
    if (err) {
      return callback({ statusCode: 500, message: "Lỗi khi tìm khách hàng" }, null);
    }

    if (results.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy khách hàng" });
    }

    const id_customer = results[0].id_customer;
    console.log(id_customer);

    Customer.getCustomerDebtAndLatestInvoice(id_customer, (err, data) => {
        if (err) {
            return callback({ statusCode: 500, message: "Lỗi khi lấy thông tin công hóa đơn và nợ" }, null);
        }
        callback(null, data);
    });
  });
};

module.exports = {
    createPaymentReceipt,
    getCustomerDebtAndLatestInvoice
};