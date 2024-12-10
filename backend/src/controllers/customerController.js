const Customer = require("../models/Customer");
const customerService = require("../services/customerService");

const createPaymentReceipt = (req, res) => {
  const { fullName, phone, address, email, payment_date, amount_received } =
    req.body;
  customerService.createPaymentReceipt(
    { fullName, phone, address, email, payment_date, amount_received },
    (err, result) => {
      if (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
      res.status(200).json(result);
    }
  );
};

const getPaymentReceipt = (req, res) => {
  // const { id_payment } = req.query;
  Customer.getPaymentReceipt((err, receipt) => {
    if (err) {
      return res.status(500).json({ error: "Lấy dữ liệu thất bại" });
    }
    if (receipt.length === 0) {
      res.status(404).json({ message: "No payment receipts found" });
    }
    res.status(200).json(receipt);
  });
};

const getCustomer = (req, res) => {
  //get by name and phone
  const { fullName, phone } = req.query;
  Customer.getCustomer({ fullName, phone }, (err, customer) => {
    if (err) {
      return res.status(500).json({ error: "Lấy dữ liệu thất bại" });
    }
    if (customer.length === 0) {
      return res.status(404).json({ message: "No customer found" });
    }
    res.status(200).json(customer[0]);
  });
};
const createPaymentInvoice = (req, res) => {
  const { fullName, phone, email, address, books } = req.body;
  books.forEach((book) => {
    book.id = null;
  });
  customerService.createPaymentInvoice(
    { fullName, phone, email, address, books },
    (err, result) => {
      if (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
      res.status(200).json(result);
    }
  );
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

const createPaymentDebt = (req, res) => {
  const { fullName, phone, email, address, books } = req.body;
  customerService.createPaymentDebt(
    { fullName, phone, email, address, books },
    (err, result) => {
      if (err) {
        return res.status(err.statusCode || 500).json({ error: err.message });
      }
      res.status(200).json(result);
    }
  );
};
module.exports = {
  createPaymentReceipt,
  getPaymentReceipt,
  createPaymentInvoice,
  createPaymentDebt,
  getCustomer,
  getCustomerDebtAndLatestInvoice,
};
