const connection = require('../config/database');

const getAllDebtReport = (callback) => {
    connection.query(`SELECT dr.id_debt_report, dr.report_month, dr.report_year, drd.id_customer, drd.initial_debt, drd.changes, drd.final_debt 
                      FROM debt_reports dr JOIN debt_reports_details drd 
                      ON dr.id_debt_report = drd.id_debt_report`, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const isDebtReportExist = (month, year, callback) => {
    connection.query(`SELECT * FROM debt_reports WHERE report_month = ? AND report_year = ?`, [month, year], (error, results) => {
        if (error) {
            console.log('lỗi1');
            return callback(error, null);
        }
        callback(null, results);
    });
}

const getDebtReport = (month, year, callback) => {
    // Check if the debt report for the given month and year exists
    isDebtReportExist(month, year, (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length === 0) {
            // Insert a new debt report if it does not exist
            const insertQuery = `
                INSERT INTO debt_reports (id_debt_report, report_month, report_year)
                SELECT CONCAT('DR', LPAD(COUNT(*) + 1, 4, '0')), ?, ?
                FROM debt_reports;
            `;
            connection.query(insertQuery, [month, year], (insertError, insertResults) => {
                if (insertError) {
                    return callback(insertError, null);
                }

                // After inserting, fetch the new debt report data
                getDebtReport(month, year, callback);
            });
        } else {
            // If the report exists, retrieve the data
            const sqlQuery = `
                WITH LastKnownDebts AS (
                    SELECT
                        drd.id_customer,
                        drd.final_debt AS last_final_debt
                    FROM debt_reports_details drd
                    JOIN debt_reports dr ON dr.id_debt_report = drd.id_debt_report
                    WHERE dr.report_year < ? OR (dr.report_year = ? AND dr.report_month < ?)
                    ORDER BY drd.id_customer, dr.report_year DESC, dr.report_month DESC
                ),
                CurrentDebts AS (
                    SELECT
                        dr.id_debt_report,
                        dr.report_month,
                        dr.report_year,
                        drd.id_customer,
                        drd.initial_debt,
                        drd.changes,
                        drd.final_debt
                    FROM debt_reports_details drd
                    JOIN debt_reports dr ON dr.id_debt_report = drd.id_debt_report
                    WHERE dr.report_month = ? AND dr.report_year = ?
                ),
                AllCustomers AS (
                    SELECT id_customer FROM CurrentDebts
                    UNION
                    SELECT id_customer FROM LastKnownDebts
                )
                SELECT
                    COALESCE(cd.id_debt_report, dr.id_debt_report) AS id_debt_report,
                    dr.report_month,
                    dr.report_year,
                    ac.id_customer,
                    COALESCE(cd.initial_debt, lkd.last_final_debt) AS initial_debt,
                    COALESCE(cd.changes, 0.00) AS changes,
                    COALESCE(cd.final_debt, COALESCE(lkd.last_final_debt, 0.00)) AS final_debt
                FROM AllCustomers ac
                LEFT JOIN CurrentDebts cd ON ac.id_customer = cd.id_customer
                LEFT JOIN LastKnownDebts lkd ON ac.id_customer = lkd.id_customer
                LEFT JOIN debt_reports dr ON dr.report_month = ? AND dr.report_year = ?;
            `;

            // Execute the query
            connection.query(sqlQuery, [year, year, month, month, year, month, year], (queryError, queryResults) => {
                if (queryError) {
                    return callback(queryError, null);
                }
                callback(null, queryResults);
            });
        }
    });
};


module.exports = {
    getAllDebtReport,
    getDebtReport
};