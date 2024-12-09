const Report = require('../models/Report');

const getDebtReport = (req, res) => {
    const { month, year } = req.query;
    Report.getDebtReport(month, year, (err, report) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to get debt report' });
        }
        res.json(report);
    });
};

const getAllDebtReport = (req, res) => {
    Report.getAllDebtReport((err, report) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to get debt report' });
        }
        res.json(report);
    });
};

module.exports = {
    getDebtReport,
    getAllDebtReport
};