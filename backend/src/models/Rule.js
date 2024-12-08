const connection = require('../config/database');

const updateRule = (rule, callback) => {
    const query = `UPDATE rules SET rule_value = ? WHERE rule_name = ?`;
    const values = [rule.rule_value, rule.rule_name];

    connection.query(query, values, (error, result) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, { message: `Rule ${rule.rule_name} updated successfully` });
        }
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
    updateRule,
    getRules,
}