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

module.exports = {
    createPaymentReceipt,
};