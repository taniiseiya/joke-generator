const Invoice = require('../models/Invoice');
const pdfGenerator = require('../utils/pdfGenerator');
const multer = require('multer');
const path = require('path');

// multer を使ってロゴアップロード設定
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage }).single('logo');

exports.createInvoice = (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    const { businessName, driverName, invoiceAmount, items } = req.body;
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // items は JSON 文字列として送信される前提
    let parsedItems = [];
    try {
      parsedItems = items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error parsing items", error);
    }

    const newInvoice = new Invoice({
      businessName,
      driverName,
      invoiceAmount,
      items: parsedItems,
      logoUrl,
    });

    newInvoice.save()
      .then(invoice => res.json(invoice))
      .catch(error => res.status(500).json({ error: error.message }));
  });
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generatePDFPreview = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    const pdfBytes = await pdfGenerator.generateInvoicePDF(invoice);
    res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');
    res.contentType("application/pdf");
    res.send(pdfBytes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};