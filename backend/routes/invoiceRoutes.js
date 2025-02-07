const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// 請求書の作成
router.post('/', invoiceController.createInvoice);

// 請求書一覧取得
router.get('/', invoiceController.getInvoices);

// PDFプレビュー生成
router.post('/:id/preview', invoiceController.generatePDFPreview);

module.exports = router;