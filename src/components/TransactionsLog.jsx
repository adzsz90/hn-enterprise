import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Trash2, 
  Sparkles
} from 'lucide-react';

export default function TransactionsLog({ transactions, onDeleteTransaction }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Filter transactions
  const filtered = transactions.filter(t => {
    const matchesSearch = 
      t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.party && t.party.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.reference && t.reference.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'ALL' || t.type === filterType;

    return matchesSearch && matchesType;
  });

  // Calculate totals for filtered transactions
  const totalStockInAmount = filtered
    .filter(t => t.type === 'STOCK_IN')
    .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

  const totalStockOutAmount = filtered
    .filter(t => t.type === 'STOCK_OUT')
    .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

  const totalProfitFromOut = filtered
    .filter(t => t.type === 'STOCK_OUT')
    .reduce((sum, t) => sum + (t.profit || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Rekod Pembelian & Perolehan</span>
          <Sparkles color="#ff85a1" size={24} />
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem', fontWeight: '600' }}>
          Sejarah lengkap stok masuk (Restock / Belian Modal) dan stok keluar (Perolehan Jualan) 💸
        </p>
      </div>

      {/* Summary Chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fff4 100%)', borderColor: '#b7efc5' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            JUMLAH PEROLEHAN (JUALAN) 🛍️
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#2b9348', marginTop: '0.2rem', fontFamily: 'var(--font-heading)' }}>
            RM {totalStockOutAmount.toFixed(2)}
          </div>
        </div>

        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fffbe6 100%)', borderColor: '#ffe066' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            JUMLAH PEMBELIAN (RESTOCK) 📦
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#d97706', marginTop: '0.2rem', fontFamily: 'var(--font-heading)' }}>
            RM {totalStockInAmount.toFixed(2)}
          </div>
        </div>

        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff0f3 100%)', borderColor: '#ffccd5' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            JUMLAH UNTUNG BERSIH 💖
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ff4d6d', marginTop: '0.2rem', fontFamily: 'var(--font-heading)' }}>
            RM {totalProfitFromOut.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1.2rem 1.4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {/* Search Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Carian Nama Produk / Rujukan ✨</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Cari cth: Hoodie, INV-8801, TikTok..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
              <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Type Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Tapis Jenis Transaksi 🌸</label>
            <select
              className="form-control"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">Semua Transaksi (In & Out)</option>
              <option value="STOCK_OUT">Stock Out (Perolehan Jualan)</option>
              <option value="STOCK_IN">Stock In (Pembelian Stok)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Jenis Transaksi</th>
                <th>Nama Produk</th>
                <th>Kuantiti</th>
                <th>Harga Seunit</th>
                <th>Jumlah (RM)</th>
                <th>Untung Margin</th>
                <th>Pelanggan / Pembekal</th>
                <th>Rujukan</th>
                <th>Tarikh & Masa</th>
                <th style={{ textAlign: 'right' }}>Padam</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    <ArrowLeftRight size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                    <div>Tiada rekod transaksi dijumpai 🌸</div>
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const isOut = t.type === 'STOCK_OUT';
                  const dateStr = new Date(t.timestamp).toLocaleString('ms-MY', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={t.id}>
                      <td>
                        <span className={`badge ${isOut ? 'badge-stock-out' : 'badge-stock-in'}`}>
                          {isOut ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                          {isOut ? 'Stock Out' : 'Stock In'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700', color: '#33272a' }}>{t.productName}</td>
                      <td style={{ fontWeight: '700' }}>
                        {isOut ? `-${t.quantity}` : `+${t.quantity}`} unit
                      </td>
                      <td>RM {Number(t.unitPrice).toFixed(2)}</td>
                      <td style={{ fontWeight: '800', color: isOut ? '#2b9348' : '#d97706', fontFamily: 'var(--font-heading)' }}>
                        {isOut ? '+' : '-'} RM {Number(t.totalAmount).toFixed(2)}
                      </td>
                      <td style={{ color: isOut ? '#2b9348' : 'var(--text-dim)', fontSize: '0.85rem', fontWeight: '700' }}>
                        {isOut ? `+RM ${Number(t.profit || 0).toFixed(2)}` : '-'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{t.party || '-'}</td>
                      <td style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem', color: '#ff4d6d', fontWeight: '600' }}>
                        {t.reference || '-'}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{dateStr}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onDeleteTransaction(t.id)}
                          style={{ color: '#ff4d6d' }}
                          title="Padam Rekod"
                        >
                          <Trash2 size={14} />
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
    </div>
  );
}
