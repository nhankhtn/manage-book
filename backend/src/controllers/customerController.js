const Customer = require('../models/Customer');

// reportDebt
const reportDebt = (req, res) => {
    const { month, year } = req.query;
    Customer.getReportDebt(month, year, (err, report) => {
        if (err) {
            return res.status(500).json({ error: 'Lấy dữ liệu thất bại' });
        }
        res.json(report);
    });
};

module.exports = {
    reportDebt
};