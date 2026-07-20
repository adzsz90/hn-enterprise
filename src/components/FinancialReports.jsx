import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Download, 
  Printer, 
  Sparkles,
  PackageCheck
} from 'lucide-react';

export default function FinancialReports({ products, transactions }) {
  // Financial computations
  const totalSales = transactions
    .filter(t => t.type === 'STOCK_OUT')
    .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

  const totalPurchases = transactions
    .filter(t => t.type === 'STOCK_IN')
    .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

  const totalNetProfit = transactions
    .filter(t => t.type === 'STOCK_OUT')
    .reduce((sum, t) => sum + (t.profit || 0), 0);

  const profitMarginPercent = totalSales > 0 ? ((totalNetProfit / totalSales) * 100).toFixed(1) : 0;

  // Current Inventory Valuation
  const totalInventoryCostValue = products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
  const totalInventoryRetailValue = products.reduce((sum, p) => sum + (p.stock * p.sellingPrice), 0);
  const potentialInventoryProfit = totalInventoryRetailValue - totalInventoryCostValue;

  // Category Breakdown
  const categoryStats = products.reduce((acc, p) => {
    const cat = p.category || 'Lain-lain';
    if (!acc[cat]) {
      acc[cat] = {
        itemCount: 0,
        totalStock: 0,
        costValue: 0,
        retailValue: 0
      };
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
    csvContent += "SKU,Nama Produk,Kategori,Saiz,Warna,Harga Kos (RM),Harga Jual (RM),Stok Semasa,Jumlah Nilai Kos (RM),Jumlah Nilai Jual (RM),Status\n";

    products.forEach(p => {
      const status = p.stock === 0 ? "SOLD OUT" : (p.stock <= (p.minStock || 5) ? "LOW STOCK" : "IN STOCK");
      const row = [
        `"${p.sku}"`,
        `"${p.name}"`,
        `"${p.category}"`,
        `"${p.size}"`,
        `"${p.color}"`,
        p.costPrice.toFixed(2),
        p.sellingPrice.toFixed(2),
        p.stock,
        (p.stock * p.costPrice).toFixed(2),
        (p.stock * p.sellingPrice).toFixed(2),
        `"${status}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Stok_HN_Enterprise_${new Date().toISOString().slice(0,10)}.csv`);
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
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Laporan Kewangan & Stok</span>
            <Sparkles color="#ff85a1" size={24} />
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem', fontWeight: '600' }}>
            Analisis comel perolehan jualan, kos modal, dan potensi nilai inventori 📊
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Cetak Penyata 🖨️</span>
          </button>
          <button className="btn btn-primary" onClick={exportCSV}>
            <Download size={16} />
            <span>Eksport CSV / Excel 📄</span>
          </button>
        </div>
      </div>

      {/* Main KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff0f3 100%)', borderColor: '#ffccd5' }}>
          <div style={{ fontSize: '0.82rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            PEROLEHAN JUALAN 💸
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.4rem', color: '#ff4d6d' }}>
            RM {totalSales.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.6rem' }}>
            Pendapatan kasar jualan stok.
          </div>
        </div>

        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fffbe6 100%)', borderColor: '#ffe066' }}>
          <div style={{ fontSize: '0.82rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            KOS RESTOCK / BELI 📦
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.4rem', color: '#d97706' }}>
            RM {totalPurchases.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.6rem' }}>
            Perbelanjaan modal stok kedai.
          </div>
        </div>

        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fff4 100%)', borderColor: '#b7efc5' }}>
          <div style={{ fontSize: '0.82rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            UNTUNG BERSIH 💖
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.4rem', color: '#2b9348' }}>
            RM {totalNetProfit.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#2b9348', fontWeight: '700', marginTop: '0.6rem' }}>
            Margin Keuntungan: {profitMarginPercent}% ✨
          </div>
        </div>

        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f3e8ff 100%)', borderColor: '#d8bbff' }}>
          <div style={{ fontSize: '0.82rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            NILAI INVENTORI 🛍️
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.4rem', color: '#7209b7' }}>
            RM {totalInventoryRetailValue.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.6rem' }}>
            Nilai jualan potensi stok kedai.
          </div>
        </div>
      </div>

      {/* Inventory Valuation Details Box */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PackageCheck size={22} color="#ff4d6d" />
          <span>Penilaian Baki Inventori Premis 🏬</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#fff5f7', padding: '1.3rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #ffccd5' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>Jumlah Nilai Modal Stok (At Cost):</span>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#d97706', marginTop: '0.3rem', fontFamily: 'var(--font-heading)' }}>
              RM {totalInventoryCostValue.toFixed(2)}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '600' }}>
              Jumlah modal yang terikat dalam stok yang belum dijual.
            </p>
          </div>

          <div style={{ background: '#e8fccf', padding: '1.3rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #b7efc5' }}>
            <span style={{ fontSize: '0.88rem', color: '#2b9348', fontWeight: '700' }}>Potensi Keuntungan Masa Depan ✨:</span>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#2b9348', marginTop: '0.3rem', fontFamily: 'var(--font-heading)' }}>
              RM {potentialInventoryProfit.toFixed(2)}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#2b9348', marginTop: '0.4rem', fontWeight: '600' }}>
              Anggaran untung bersih apabila kesemua stok di atas dijual.
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PieChart size={22} color="#7209b7" />
          <span>Pecahan Prestasi Stok Mengikut Kategori 🏷️</span>
        </h3>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Kategori Produk</th>
                <th>Bilangan SKU</th>
                <th>Jumlah Baki Unit</th>
                <th>Nilai Modal (RM)</th>
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
