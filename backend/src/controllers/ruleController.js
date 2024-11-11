const Rule = require('../models/Rule');
const ruleService = require('../services/ruleService');
const { all } = require('../routes/ruleRoutes');

const updateRules = (req, res) => {
    const {
        minImportQuantity,
        minStockQuantityBeforeImport,
        maxDebt,
        minStockAfterSale,
        allowOverpayment
    } = req.body;

    const rulesToUpdate = [
        { rule_name: 'minImportQuantity', rule_value: minImportQuantity },
        { rule_name: 'minStockQuantityBeforeImport', rule_value: minStockQuantityBeforeImport },
        { rule_name: 'maxDebt', rule_value: maxDebt },
        { rule_name: 'minStockAfterSale', rule_value: minStockAfterSale },
        { rule_name: 'allowOverpayment', rule_value: allowOverpayment }
    ];

    ruleService.updateRules(rulesToUpdate, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update rules', details: err });
        }
        res.json({ message: 'Rules updated successfully', result });
    });
};

const getRules = (req, res) => {
    Rule.getRules((err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to get rules' });
        }
        res.json(result);
    });
}

module.exports = {
    updateRules,
    getRules
};