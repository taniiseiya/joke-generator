const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  businessName: { type: String, required: true },
  driverName: { type: String, required: true },
  invoiceAmount: { type: Number, required: true },
  items: [
    {
      description: String,
      amount: Number
    }
  ],
  logoUrl: String,
  status: { type: String, enum: ['未払い', '支払い済み'], default: '未払い' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);