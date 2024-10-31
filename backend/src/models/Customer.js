const connection = require('../config/database');
const generate = require('../utils/generate');

const getReportDebt = (month, year, callback) => {
    connection.query(`SELECT c.full_name, drd.initial_debt, drd.changes, drd.final_debt
                      FROM debt_reports_details drd inner join debt_reports dr on drd.id_debt_report = dr.id_debt_report
                                                   inner join customers c on c.id_customer = drd.id_customer
                      where MONTH(dr.report_date) = ? AND YEAR(dr.report_date) = ?`, [month, year], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const getIDCustomer = async (full_name, phone, address, email, callback) => {
    connection.query(`SELECT id_customer FROM customers WHERE full_name = ? AND phone = ? AND address = ? AND email = ?`, [full_name, phone, address, email], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const createPaymentReceipt = (id_customer, payment_date, amount_received, callback) => {
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
}

module.exports = {
    getReportDebt,
    getIDCustomer,
    createPaymentReceipt,
    getPaymentReceipt
};