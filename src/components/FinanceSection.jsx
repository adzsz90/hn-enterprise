import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft,
  PieChart, 
  Download, 
  Printer, 
  Search,
  ShoppingCart,
  Trash2,
  Package,
  Calendar,
  Filter
} from 'lucide-react';

export default function FinanceSection({ 
  products, 
  transactions, 
  onOpenMovementModal,
  onDeleteTransaction 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [txFilter, setTxFilter] = useState('ALL'); // 'ALL', 'STOCK_OUT' (Jualan), 'STOCK_IN' (Pembelian)

  // Sort transactions by timestamp (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Filter transactions
  const filteredTransactions = sortedTransactions.filter(t => {
    const matchesSearch = 
      t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.party && t.party.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.reference && t.reference.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesType = true;
    if (txFilter === 'STOCK_OUT') matchesType = t.type === 'STOCK_OUT';
    else if (txFilter === 'STOCK_IN') matchesType = t.type === 'STOCK_IN';

    return matchesSearch && matchesType;
  });

  // Financial computations (Counts only confirmed / approved transactions)
  const salesTransactions = transactions.filter(t => t.type === 'STOCK_OUT' && (t.status === 'APPROVED' || !t.status));
  const purchaseTransactions = transactions.filter(t => t.type === 'STOCK_IN' && (t.status === 'APPROVED' || !t.status));

  const totalSales = salesTransactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
  const totalPurchases = purchaseTransactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
  const totalNetProfit = salesTransactions.reduce((sum, t) => sum + (t.profit || 0), 0);
  const profitMarginPercent = totalSales > 0 ? ((totalNetProfit / totalSales) * 100).toFixed(1) : 0;

  // Inventory Valuation
  const totalInventoryCostValue = products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
  const totalInventoryRetailValue = products.reduce((sum, p) => sum + (p.stock * p.sellingPrice), 0);

  // Category Breakdown
  const categoryStats = products.reduce((acc, p) => {
    const cat = p.category || 'Lain-lain';
    if (!acc[cat]) {
      acc[cat] = { itemCount: 0, totalStock: 0, costValue: 0, retailValue: 0 };
    }
    acc[cat].itemCount += 1;
    acc[cat].totalStock += p.stock;
    acc[cat].costValue += (p.stock * p.costPrice);
    acc[cat].retailValue += (p.stock * p.sellingPrice);
    return acc;
  }, {});

  // CSV Export handler
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Tarikh,Jenis Transaksi,Nama Produk,Kuantiti,Harga Seunit (RM),Jumlah Keseluruhan (RM),Untung Bersih (RM),Saluran/Pembekal,Rujukan\n";

    filteredTransactions.forEach(t => {
      const row = [
        `"${new Date(t.timestamp).toLocaleDateString('ms-MY')}"`,
        `"${t.type === 'STOCK_OUT' ? 'Jualan (Stock Out)' : 'Pembelian (Stock In)'}"`,
        `"${t.productName}"`,
        t.quantity,
        t.unitPrice.toFixed(2),
        t.totalAmount.toFixed(2),
        (t.profit || 0).toFixed(2),
        `"${t.party || ''}"`,
        `"${t.reference || ''}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Kewangan_HN_Enterprise_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      {/* Header & Export Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            Bahagian Kewangan & Perolehan Jualan 💸
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem', fontWeight: '600' }}>
            Rekod jualan, rekod kos pembelian stok, untung bersih, serta pengurusan sejarah transaksi.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-success" 
            onClick={() => onOpenMovementModal('STOCK_OUT')}
          >
            <ArrowUpRight size={18} />
            <span>+ Rekod Jualan (Stock Out) 🛍️</span>
          </button>

          <button 
            className="btn btn-primary" 
            onClick={() => onOpenMovementModal('STOCK_IN')}
            style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}
          >
            <ArrowDownLeft size={18} />
            <span>+ Rekod Pembelian Stok (Stock In) 🚚</span>
          </button>

          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Cetak Penyata 🖨️</span>
          </button>

          <button className="btn btn-secondary" onClick={exportCSV}>
            <Download size={16} />
            <span>Eksport CSV 📄</span>
          </button>
        </div>
      </div>

      {/* Main KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Total Sales Card */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff0f3 100%)', borderColor: '#ffccd5' }}>
          <div style={{ fontSize: '0.8rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            JUMLAH PEROLEHAN JUALAN 💸
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.4rem', color: '#ff4d6d', fontFamily: 'var(--font-heading)' }}>
            RM {totalSales.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.6rem' }}>
            {salesTransactions.length} transaksi jualan direkodkan.
          </div>
        </div>

        {/* Total Cost of Pembelian Card */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fffbe6 100%)', borderColor: '#ffe066' }}>
          <div style={{ fontSize: '0.8rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            KOS PEMBELIAN STOK 📦
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.4rem', color: '#d97706', fontFamily: 'var(--font-heading)' }}>
            RM {totalPurchases.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.6rem' }}>
            {purchaseTransactions.length} transaksi belian stok direkodkan.
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fff4 100%)', borderColor: '#b7efc5' }}>
          <div style={{ fontSize: '0.8rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            UNTUNG BERSIH (NET PROFIT) 💖
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.4rem', color: '#2b9348', fontFamily: 'var(--font-heading)' }}>
            RM {totalNetProfit.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#2b9348', fontWeight: '700', marginTop: '0.6rem' }}>
            Margin Keuntungan: {profitMarginPercent}% ✨
          </div>
        </div>

        {/* Potential Inventory Sales Value Card */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f3e8ff 100%)', borderColor: '#d8bbff' }}>
          <div style={{ fontSize: '0.8rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            NILAI JUALAN BAKI INVENTORI 🛍️
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.4rem', color: '#7209b7', fontFamily: 'var(--font-heading)' }}>
            RM {totalInventoryRetailValue.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.6rem' }}>
            Anggaran nilai jualan baki stok gudang.
          </div>
        </div>
      </div>

      {/* Complete Financial History Table (With Filter & Delete Action) */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={22} color="#2b9348" />
            <span>Sejarah Log Transaksi Kewangan & Aliran Duit 📑</span>
          </h3>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              value={txFilter}
              onChange={(e) => setTxFilter(e.target.value)}
              style={{ width: 'auto', fontSize: '0.85rem', padding: '0.45rem 1rem', borderRadius: 'var(--radius-full)' }}
            >
              <option value="ALL">🌸 Semua Transaksi (Jualan & Belian)</option>
              <option value="STOCK_OUT">🛍️ Jualan (Stock Out)</option>
              <option value="STOCK_IN">🚚 Pembelian Stok (Stock In)</option>
            </select>

            <div style={{ position: 'relative', width: '220px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Cari transaksi / rujukan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.2rem', padding: '0.45rem 0.8rem 0.45rem 2.2rem', fontSize: '0.85rem', borderRadius: 'var(--radius-full)' }}
              />
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Jenis Transaksi</th>
                <th>Nama Produk</th>
                <th>Kuantiti</th>
                <th>Harga / Unit</th>
                <th>Jumlah (RM)</th>
                <th>Untung (RM)</th>
                <th>Saluran / Pembekal</th>
                <th>No. Ref / Invois</th>
                <th>Tarikh & Masa</th>
                <th style={{ textAlign: 'right' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontWeight: '600' }}>
                    Tiada rekod transaksi kewangan ditemui 🌸
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isOut = tx.type === 'STOCK_OUT';
                  const isPending = tx.status === 'PENDING_APPROVAL';
                  const isRejected = tx.status === 'REJECTED';

                  return (
                    <tr key={tx.id}>
                      <td>
                        {isPending ? (
                          <span className="badge badge-low-stock" style={{ background: '#fff3bf', color: '#d97706' }}>
                            ⏳ Pending Sahkan
                          </span>
                        ) : isRejected ? (
                          <span className="badge badge-sold-out">
                            ❌ Dibatalkan
                          </span>
                        ) : (
                          <span className={`badge ${isOut ? 'badge-stock-out' : 'badge-stock-in'}`}>
                            {isOut ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                            {isOut ? 'Jualan (Disahkan)' : 'Pembelian (Stock In)'}
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: '700', color: '#33272a' }}>{tx.productName}</td>
                      <td style={{ fontWeight: '800', color: isOut ? '#ff124f' : '#2b9348' }}>
                        {isOut ? `-${tx.quantity}` : `+${tx.quantity}`} unit
                      </td>
                      <td>RM {Number(tx.unitPrice).toFixed(2)}</td>
                      <td style={{ fontWeight: '800', color: isOut ? '#2b9348' : '#d97706', fontFamily: 'var(--font-heading)' }}>
                        {isOut ? '+' : '-'} RM {Number(tx.totalAmount).toFixed(2)}
                      </td>
                      <td style={{ fontWeight: '800', color: isOut ? '#2b9348' : 'var(--text-muted)', fontSize: '0.88rem' }}>
                        {isOut ? `+RM ${Number(tx.profit || 0).toFixed(2)}` : '-'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{tx.party || '-'}</td>
                      <td style={{ fontFamily: 'var(--font-heading)', color: '#ff4d6d', fontSize: '0.85rem' }}>{tx.reference || '-'}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        {new Date(tx.timestamp).toLocaleString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onDeleteTransaction(tx.id)}
                          title="Padam Rekod Transaksi Ini"
                          style={{ padding: '0.3rem 0.6rem', color: '#ff4d6d', borderColor: '#ffccd5' }}
                        >
                          <Trash2 size={13} /> Padam
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown Performance */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PieChart size={22} color="#7209b7" />
          <span>Pecahan Nilai Modal & Potensi Jualan Inventori 🏷️</span>
        </h3>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Kategori Produk</th>
                <th>Bilangan SKU</th>
                <th>Jumlah Baki Unit</th>
                <th>Nilai Modal Restock (RM)</th>
                <th>Nilai Jualan (RM)</th>
                <th>Potensi Profit (RM)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoryStats).map(([catName, stat]) => {
                const profit = stat.retailValue - stat.costValue;
                return (
                  <tr key={catName}>
                    <td style={{ fontWeight: '700', color: '#33272a' }}>{catName}</td>
                    <td>{stat.itemCount} jenis</td>
                    <td style={{ fontWeight: '700', color: '#7209b7' }}>{stat.totalStock} unit</td>
                    <td>RM {stat.costValue.toFixed(2)}</td>
                    <td style={{ fontWeight: '700' }}>RM {stat.retailValue.toFixed(2)}</td>
                    <td style={{ fontWeight: '800', color: '#2b9348' }}>+RM {profit.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
