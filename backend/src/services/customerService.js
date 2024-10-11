const connection = require('../config/database');

const take_reportDebt = (month, year, callback) => {
    connection.query(`SELECT c.FULL_NAME, drd.INITIAL_DEBT, drd.CHANGES, drd.FINAL_DEBT
                      FROM DEBT_REPORT_DETAILS drd inner join DEBT_REPORT dr on drd.ID_DEBT_REPORT = dr.ID_DEBT_REPORT
                                                   inner join CUSTOMER c on c.ID_CUSTOMER = drd.ID_CUSTOMER
                      where MONTH(dr.REPORT_DATE) = ? AND YEAR(dr.REPORT_DATE) = ?`, [month, year], (error, results) => {   
        if (error) {    
            return callback(error, null);
        }
        callback(null, results);
    });
};

module.exports = {
    take_reportDebt
};