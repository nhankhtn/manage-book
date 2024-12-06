const connection = require('../config/database');
const { get } = require('../routes/bookRoutes');
const generate = require('../utils/generate');

const getIDCustomer = async (full_name, phone, address, email, callback) => {
    connection.query(`SELECT id_customer FROM customers WHERE full_name = ? AND phone = ? AND address = ? AND email = ?`, [full_name, phone, address, email], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const createPaymentReceipt = (id_customer, payment_date, amount_received, callback) => {
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
}

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
    getReportDebt,
    getIDCustomer,
    createPaymentReceipt,
    getPaymentReceipt,
    getCustomerDebtAndLatestInvoice,
    // getCustomerDebt,
    // updateCustomerDebt,
};