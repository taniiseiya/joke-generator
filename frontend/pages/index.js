import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/invoices')
      .then(response => setInvoices(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container">
      <h1>請求書ダッシュボード</h1>
      <Link href="/invoice"><a>新しい請求書作成</a></Link>
      <h2>請求書一覧</h2>
      <ul>
        {invoices.map(inv => (
          <li key={inv._id} style={{ marginBottom: '20px' }}>
            <div>{inv.businessName} - {inv.driverName} - ¥{inv.invoiceAmount} - {inv.status}</div>
            <Link href={`/invoice?previewId=${inv._id}`}><a>PDFプレビュー</a></Link>
          </li>
        ))}
      </ul>
    </div>
  );
}