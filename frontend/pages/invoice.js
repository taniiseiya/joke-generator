import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function InvoicePage() {
  const router = useRouter();
  const { previewId } = router.query;
  const [formData, setFormData] = useState({
    businessName: '',
    driverName: '',
    invoiceAmount: '',
    items: [{ description: '', amount: '' }]
  });
  const [logo, setLogo] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: '', amount: '' }] });
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append('businessName', formData.businessName);
    submissionData.append('driverName', formData.driverName);
    submissionData.append('invoiceAmount', formData.invoiceAmount);
    submissionData.append('items', JSON.stringify(formData.items));
    if (logo) {
      submissionData.append('logo', logo);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/invoices', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('請求書が作成されました。');
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました。');
    }
  };

  // previewId がある場合、PDFプレビュー表示用の処理
  const handlePDFPreview = async (invoiceId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/invoices/${invoiceId}/preview`, {}, {
        responseType: 'blob'
      });
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      setPdfUrl(fileURL);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>請求書作成</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>事業者名:</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ドライバー名:</label>
          <input
            type="text"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>請求額:</label>
          <input
            type="number"
            name="invoiceAmount"
            value={formData.invoiceAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>項目追加:</label>
          {formData.items.map((item, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="配送先"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="金額"
                value={item.amount}
                onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addItem}>項目追加</button>
        </div>
        <div>
          <label>会社ロゴアップロード:</label>
          <input type="file" accept="image/*" onChange={handleLogoChange}/>
        </div>
        <button type="submit">請求書作成</button>
      </form>

      {previewId && (
        <div style={{ marginTop: '40px' }}>
          <h2>PDFプレビュー</h2>
          <button onClick={() => handlePDFPreview(previewId)}>プレビュー表示</button>
          {pdfUrl && (
            <iframe src={pdfUrl} width="100%" height="600px" title="PDF Preview" style={{ marginTop: '20px' }}></iframe>
          )}
        </div>
      )}
    </div>
  );
}