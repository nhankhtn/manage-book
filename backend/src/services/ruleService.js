const Rule = require('../models/Rule');

const updateRules = (rules, finalCallback) => {
    let errors = [];
    let successCount = 0;

    rules.forEach((rule, index) => {
        Rule.updateRule(rule, (error, result) => {
            if (error) {
                errors.push(error);
            } else {
                successCount++;
            }

            if (index === rules.length - 1) {
                if (errors.length > 0) {
                    finalCallback(errors, null);
                } else {
                    finalCallback(null, { message: `${successCount} rules updated successfully` });
                }
            }
        });
    });
};

module.exports = { 
    updateRules 
};
