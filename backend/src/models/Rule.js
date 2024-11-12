const connection = require('../config/database');

const updateRules = (rules, callback) => {
    let query = '';
    const values = [];
    const errors = [];
    let successCount = 0;

    // Loop through the rules and create queries for each
    rules.forEach((rule, index) => {
        const query = `UPDATE rules SET rule_value = ? WHERE rule_name = ?`;
        const values = [rule.rule_value, rule.rule_name];

        connection.query(query, values, (error, result) => {
            if (error) {
                errors.push(error);
            } else {
                successCount++;
            }

            // After the last query, call the callback
            if (index === rules.length - 1) {
                if (errors.length > 0) {
                    callback(errors, null);
                } else {
                    callback(null, { message: `${successCount} rules updated successfully` });
                }
            }
        });
    });
};



const getRules = (callback) => {
    const query = `SELECT * FROM rules`;

    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null); 
        }
        callback(null, results);
    });
}

module.exports = {
    updateRules,
    getRules
}