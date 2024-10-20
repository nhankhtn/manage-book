const connection = require('../config/database');

const updateRules = (rules, callback) => {
    const queries = rules.map((rule) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE rules SET rule_value = ? WHERE rule_name = ?`;
            const values = [rule.rule_value, rule.rule_name];

            connection.query(query, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    });

    // Execute all update queries
    Promise.all(queries)
        .then(results => callback(null, results))
        .catch(error => callback(error, null));
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