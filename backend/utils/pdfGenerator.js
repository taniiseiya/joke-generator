const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

exports.generateInvoicePDF = async (invoice) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  // 日本語フォントを読み込み
  const fontPath = path.join(__dirname, '../public/fonts/NotoSansCJKjp-Regular.otf');
  const fontBytes = fs.readFileSync(fontPath);
  const font = await pdfDoc.embedFont(fontBytes);

  const fontSize = 12;
  let y = height - 50;

  page.drawText(`事業者名: ${invoice.businessName}`, {
    x: 50,
    y,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0)
  });
  y -= 20;
  page.drawText(`ドライバー名: ${invoice.driverName}`, {
    x: 50,
    y,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0)
  });
  y -= 20;
  page.drawText(`請求額: ¥${invoice.invoiceAmount}`, {
    x: 50,
    y,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0)
  });
  y -= 30;
  page.drawText(`内訳:`, {
    x: 50,
    y,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0)
  });
  y -= 20;

  invoice.items.forEach(item => {
    page.drawText(`${item.description} - ¥${item.amount}`, {
      x: 70,
      y,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0)
    });
    y -= 20;
  });

  // 消費税(10%)と合計金額の計算
  const tax = invoice.invoiceAmount * 0.1;
  const total = invoice.invoiceAmount + tax;
  y -= 20;
  page.drawText(`消費税 (10%): ¥${tax.toFixed(2)}`, {
    x: 50,
    y,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0)
  });
  y -= 20;
  page.drawText(`合計金額: ¥${total.toFixed(2)}`, {
    x: 50,
    y,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0)
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};