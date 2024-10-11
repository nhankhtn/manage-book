const Customer = require('../services/customerService');

// reportDebt
const reportDebt = (req, res) => {
    const { month, year } = req.body;
    Customer.take_reportDebt(month, year, (err, report) => {
        if (err) {
            return res.status(500).json({ error: 'Lấy dữ liệu thất bại' });
        }
        res.json(report);
    });
};

module.exports = {
    reportDebt
};