const Report = require("../models/Report");

const getDebtReport = (req, res) => {
  const { month, year } = req.query;
  Report.getDebtReport(month, year, (err, report) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get debt report" });
    }
    res.json(report);
  });
};

const getAllDebtReport = (req, res) => {
  Report.getAllDebtReport((err, report) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get debt report" });
    }
    res.json(report);
  });
};

// Get stock report

const getAllStockReport = (req, res) => {
  Report.getAllStockReport((err, report) => {
    console.log(report);
    if (err) {
      return res.status(500).json({ error: "Failed to get stock report" });
    }
    res.json(report);
  });
};

const getStockReport = (req, res) => {
  const { month, year } = req.query;
  Report.getStockReport(month, year, (err, report) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get stock report" });
    }
    res.json(report);
  });
};

module.exports = {
  getDebtReport,
  getAllDebtReport,
  getStockReport,
  getAllStockReport,
};
