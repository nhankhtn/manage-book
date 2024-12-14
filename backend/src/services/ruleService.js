const Rule = require("../models/Rule");
const connection = require("../config/database");

const updateRules = (rules, callback) => {
  connection.beginTransaction((error) => {
    if (error) return callback(error, null);

    let errors = [];

    const processRule = (index) => {
      if (index >= rules.length) {
        return connection.commit((commitError) => {
          if (commitError) {
            return connection.rollback(() => {
              callback(commitError, null);
            });
          }
          callback(null, { message: `Rules updated successfully` });
        });
      }

      Rule.updateRule(rules[index], (error, result) => {
        if (error) {
          errors.push(error);
          return connection.rollback(() => {
            callback(errors, null);
          });
        }
        processRule(index + 1);
      });
    };

    processRule(0);
  });
};

module.exports = {
  updateRules,
};
