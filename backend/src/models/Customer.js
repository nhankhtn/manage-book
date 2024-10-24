const connection = require('../config/database');

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

module.exports = {
    getReportDebt
};