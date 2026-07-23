import React, { useState } from 'react';
import { 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight,
  AlertTriangle, 
  Plus,
  Search, 
  CheckCircle2, 
  Heart,
  Clock,
  Edit2,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

export default function StockSection({ 
  products, 
  transactions, 
  onOpenProductModal,
  onDeleteProduct,
  onOpenMovementModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('ALL');

  // Filter products for stock management
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (stockFilter === 'SOLD_OUT') matchesStatus = p.stock === 0;
    else if (stockFilter === 'LOW_STOCK') matchesStatus = p.stock > 0 && p.stock <= (p.minStock || 5);
    else if (stockFilter === 'IN_STOCK') matchesStatus = p.stock > (p.minStock || 5);

    return matchesSearch && matchesStatus;
  });

  // Calculations
  const stockInTransactions = transactions
    .filter(t => t.type === 'STOCK_IN')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const stockCostVal = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.costPrice || 0)), 0);
  const totalUnitsSold = transactions
    .filter(t => t.type === 'STOCK_OUT' && (t.status === 'APPROVED' || !t.status))
    .reduce((sum, t) => sum + (t.quantity || 0), 0);
  const totalCurrentStockPcs = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      {/* Header & Main Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            Bahagian Pengurusan Stok 📦
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem', fontWeight: '600' }}>
            Tambah pakaian baharu (upload gambar), kemas kini stok, dan kawal nilai inventori.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => onOpenProductModal(null)}
          >
            <Plus size={18} />
            <span>+ Add Item / Tambah Stok Baru 👚</span>
          </button>
        </div>
      </div>

      {/* Stock Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fffbe6 100%)', borderColor: '#ffe066' }}>
          <div style={{ fontSize: '0.8rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            Stok Kos (Stock Cost) 📦
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.3rem', color: '#d97706', fontFamily: 'var(--font-heading)' }}>
            RM {stockCostVal.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '600' }}>
            Current Stock × Harga Kos ({totalCurrentStockPcs} unit)
          </div>
        </div>

        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff0f3 100%)', borderColor: '#ffccd5' }}>
          <div style={{ fontSize: '0.8rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            Stok Dijual (Pcs) 🛍️
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.3rem', color: '#ff4d6d', fontFamily: 'var(--font-heading)' }}>
            {totalUnitsSold} Pcs
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '600' }}>
            Jumlah bilangan unit produk yang telah terjual.
          </div>
        </div>
      </div>

      {/* Main Stock Inventory & Product Management Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={22} color="#ff4d6d" />
            <span>Senarai Stok & Kawalan Inventori Pakaian</span>
          </h3>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              style={{ width: 'auto', fontSize: '0.85rem', padding: '0.45rem 1rem', borderRadius: 'var(--radius-full)' }}
            >
              <option value="ALL">Semua Status Stok</option>
              <option value="SOLD_OUT">Kehabisan (Sold Out 🎀)</option>
              <option value="LOW_STOCK">Stok Amaran (Low Stock ⚠️)</option>
              <option value="IN_STOCK">Ada Stok (In Stock 🌸)</option>
            </select>

            <div style={{ position: 'relative', width: '200px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Cari SKU / Baju..."
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
                <th>Gambar</th>
                <th>Status Stok</th>
                <th>SKU</th>
                <th>Nama Produk Pakaian</th>
                <th>Saiz & Warna</th>
                <th>Kos Beli (RM)</th>
                <th>Harga Jual (RM)</th>
                <th>Baki Stok Semasa</th>
                <th style={{ textAlign: 'right' }}>Kawalan Stok & Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isSoldOut = p.stock === 0;
                const isLowStock = p.stock > 0 && p.stock <= (p.minStock || 5);

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ width: '42px', height: '52px', borderRadius: '8px', overflow: 'hidden', background: '#fff0f3', border: '1px solid #ffccd5' }}>
                        <img 
                          src={p.image || '/images/oversized_graphic_tee.jpg'} 
                          alt={p.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                    </td>
                    <td>
                      {isSoldOut ? (
                        <span className="badge badge-sold-out"><Heart size={12} fill="#ff124f" /> SOLD OUT</span>
                      ) : isLowStock ? (
                        <span className="badge badge-low-stock"><AlertTriangle size={12} /> LOW STOCK</span>
                      ) : (
                        <span className="badge badge-in-stock"><CheckCircle2 size={12} /> ADA STOK</span>
                      )}
                    </td>
                    <td style={{ fontFamily: 'var(--font-heading)', color: '#ff4d6d', fontWeight: '600' }}>{p.sku}</td>
                    <td style={{ fontWeight: '700', color: '#33272a' }}>{p.name}</td>
                    <td>{p.size} / {p.color}</td>
                    <td>RM {Number(p.costPrice).toFixed(2)}</td>
                    <td style={{ fontWeight: '700' }}>RM {Number(p.sellingPrice).toFixed(2)}</td>
                    <td>
                      <strong style={{ fontSize: '1.05rem', color: isSoldOut ? '#ff124f' : isLowStock ? '#d97706' : '#2b9348' }}>
                        {p.stock} unit
                      </strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenMovementModal('STOCK_IN', p)}
                          title="Restock Stok"
                          style={{ padding: '0.35rem 0.65rem', color: '#2b9348', borderColor: '#b7efc5', background: '#e8fccf' }}
                        >
                          <ArrowDownLeft size={14} /> Restock
                        </button>

                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenProductModal(p)}
                          title="Edit Maklumat & Stok Pakaian"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          <Edit2 size={14} /> Edit
                        </button>

                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onDeleteProduct(p.id)}
                          title="Padam Pakaian"
                          style={{ padding: '0.35rem 0.6rem', color: '#ff4d6d', borderColor: '#ffccd5' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Rekod Restock (Stock In History) */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={22} color="#d97706" />
          <span>Sejarah Log Pembelian & Restock Stok (Stock In) 🚚</span>
        </h3>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Produk Restock</th>
                <th>Kuantiti Restock</th>
                <th>Kos Seunit (RM)</th>
                <th>Jumlah Kos (RM)</th>
                <th>Pembekal / Supplier</th>
                <th>No. Rujukan / PO</th>
                <th>Tarikh & Masa</th>
              </tr>
            </thead>
            <tbody>
              {stockInTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontWeight: '600' }}>
                    Tiada rekod restock ditemui 🌸
                  </td>
                </tr>
              ) : (
                stockInTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: '700', color: '#33272a' }}>{tx.productName}</td>
                    <td style={{ fontWeight: '800', color: '#2b9348' }}>+{tx.quantity} unit</td>
                    <td>RM {Number(tx.unitPrice).toFixed(2)}</td>
                    <td style={{ fontWeight: '800', color: '#d97706' }}>- RM {Number(tx.totalAmount).toFixed(2)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{tx.party || '-'}</td>
                    <td style={{ fontFamily: 'var(--font-heading)', color: '#ff4d6d', fontSize: '0.85rem' }}>{tx.reference || '-'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {new Date(tx.timestamp).toLocaleString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
