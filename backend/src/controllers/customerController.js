const Customer = require('../models/Customer');
const customerService = require('../services/customerService');

const createPaymentReceipt = (req, res) => {
    const { full_name, phone, address, email, payment_date, amount_received } = req.body;
    customerService.createPaymentReceipt(
      { full_name, phone, address, email, payment_date, amount_received },
      (err, result) => {
        if (err) {
            return res.status(err.statusCode || 500).json({ error: err.message });
        }
        res.status(200).json(result);
      });
}

const getPaymentReceipt = (req, res) => {
    // const { id_payment } = req.query;
    Customer.getPaymentReceipt((err, receipt) => {
        if (err) {
            return res.status(500).json({ error: 'Lấy dữ liệu thất bại' });
        }
        if (receipt.length === 0) {
            res.status(404).json({ message: 'No payment receipts found' });
        }
        res.status(200).json(receipt);
    });
};

const getCustomerDebtAndLatestInvoice = (req, res) => {
  const { full_name, phone, address, email } = req.body;

  customerService.getCustomerDebtAndLatestInvoice(
    { full_name, phone, address, email },
    (err, data) => {
      if (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
      res.status(200).json(data);
    }
  );
};  

module.exports = {
    createPaymentReceipt,
    getPaymentReceipt,
    getCustomerDebtAndLatestInvoice
};
