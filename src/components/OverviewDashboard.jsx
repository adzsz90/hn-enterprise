import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  PackageCheck, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  Sparkles,
  Heart,
  Tag,
  CheckCircle,
  XCircle,
  ShoppingCart
} from 'lucide-react';

export default function OverviewDashboard({ 
  products, 
  transactions, 
  onConfirmOrder,
  onRejectOrder,
  setActiveTab 
}) {
  // Pending customer orders waiting for Admin confirmation
  const pendingOrders = transactions.filter(t => t.status === 'PENDING_APPROVAL');

  // Approved sales & purchase transactions for financial computations
  const approvedSales = transactions.filter(t => t.type === 'STOCK_OUT' && (t.status === 'APPROVED' || !t.status));
  const approvedPurchases = transactions.filter(t => t.type === 'STOCK_IN' && (t.status === 'APPROVED' || !t.status));

  const totalSales = approvedSales.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
  const totalCostOfStockBought = approvedPurchases.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
  const totalProfit = approvedSales.reduce((sum, t) => sum + (t.profit || 0), 0);

  // Stock inventory metrics
  const totalProducts = products.length;
  const soldOutProducts = products.filter(p => p.stock === 0);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= (p.minStock || 5));
  const inStockProducts = products.filter(p => p.stock > (p.minStock || 5));

  // Latest 5 transactions sorted by timestamp
  const latestTransactions = [...transactions]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      {/* Header & Quick Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Overview & Ringkasan Kedai</span>
            <Sparkles color="#ff85a1" size={24} />
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem', fontWeight: '600' }}>
            Sahkan pesanan masuk pelanggan, pantau statistik jualan, dan semak baki stok.
          </p>
        </div>

        {pendingOrders.length > 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #ff85a1 0%, #ff4d6d 100%)', 
            color: '#ffffff', 
            padding: '0.55rem 1.2rem', 
            borderRadius: 'var(--radius-full)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            boxShadow: '0 4px 15px rgba(255, 133, 161, 0.4)',
            fontSize: '0.85rem',
            fontWeight: '700',
            animation: 'cute-bounce 1.5s infinite ease-in-out'
          }}>
            <ShoppingCart size={18} />
            <span>{pendingOrders.length} Pesanan Baru Menunggu Pengesahan! ⏳</span>
          </div>
        )}
      </div>

      {/* PENDING CUSTOMER ORDERS APPROVAL SECTION */}
      <div className="glass-card" style={{ border: '2.5px solid #ff85a1', background: '#ffffff', boxShadow: 'var(--shadow-glow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffe5ec', color: '#ff4d6d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ff4d6d' }}>
                Pesanan Masuk Menunggu Pengesahan Admin ⏳
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Tekan <strong>"Sahkan Pembelian"</strong> untuk tolak stok dan kemas kini rekod kewangan.
              </span>
            </div>
          </div>

          <span style={{ background: '#fff0f3', color: '#ff4d6d', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontWeight: '700', fontSize: '0.8rem', border: '1px solid #ffccd5' }}>
            {pendingOrders.length} Pesanan Belum Disahkan
          </span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Nama Pelanggan & Saluran</th>
                <th>Produk Dipesan</th>
                <th>Kuantiti</th>
                <th>Harga / Unit</th>
                <th>Jumlah Bayaran (RM)</th>
                <th>Tarikh & Masa</th>
                <th style={{ textAlign: 'right' }}>Tindakan Pengesahan</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.2rem', fontWeight: '600' }}>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#2b9348', marginBottom: '0.2rem' }}>
                      ✨ Tiada pesanan baharu yang menunggu pengesahan.
                    </div>
                    Semua pesanan pelanggan telah disahkan secara teratur! 🌸
                  </td>
                </tr>
              ) : (
                pendingOrders.map((tx) => (
                  <tr key={tx.id} style={{ background: '#fffafb' }}>
                    <td>
                      <span className="badge badge-low-stock" style={{ background: '#fff3bf', color: '#d97706', border: '1px solid #ffe066' }}>
                        ⏳ MENUNGGU PENGESAHAN
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: '#33272a' }}>{tx.party || 'Pelanggan Storefront'}</td>
                    <td style={{ fontWeight: '700', color: '#ff4d6d' }}>{tx.productName}</td>
                    <td style={{ fontWeight: '800' }}>{tx.quantity} unit</td>
                    <td>RM {Number(tx.unitPrice).toFixed(2)}</td>
                    <td style={{ fontWeight: '800', color: '#2b9348', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
                      RM {Number(tx.totalAmount).toFixed(2)}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {new Date(tx.timestamp).toLocaleString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => onConfirmOrder(tx.id)}
                          style={{ padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)' }}
                        >
                          <CheckCircle size={15} /> Sahkan Pembelian ✅
                        </button>

                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onRejectOrder(tx.id)}
                          style={{ padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)', color: '#ff4d6d', borderColor: '#ffccd5' }}
                        >
                          <XCircle size={15} /> Batal
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Primary Financial Stat Cards (Approved Figures) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.25rem' }}>
        {/* Total Sales Card */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff0f3 100%)', borderColor: '#ffccd5', cursor: 'pointer' }} onClick={() => setActiveTab('finance')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                Perolehan Jualan (Disahkan) 💸
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.3rem', color: '#ff4d6d' }}>
                RM {totalSales.toFixed(2)}
              </h2>
            </div>
            <div style={{ padding: '0.7rem', borderRadius: '16px', background: '#ffe5ec', color: '#ff4d6d' }}>
              <DollarSign size={26} />
            </div>
          </div>
          <div style={{ marginTop: '0.8rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {approvedSales.length} transaksi jualan sah disahkan.
          </div>
        </div>

        {/* Total Cost of Pembelian Card */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fffbe6 100%)', borderColor: '#ffe066', cursor: 'pointer' }} onClick={() => setActiveTab('stock')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                Pembelian Stok (Cost) 📦
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.3rem', color: '#d97706' }}>
                RM {totalCostOfStockBought.toFixed(2)}
              </h2>
            </div>
            <div style={{ padding: '0.7rem', borderRadius: '16px', background: '#fff3bf', color: '#d97706' }}>
              <ShoppingBag size={26} />
            </div>
          </div>
          <div style={{ marginTop: '0.8rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Modal belanja restock produk kedai.
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fff4 100%)', borderColor: '#b7efc5', cursor: 'pointer' }} onClick={() => setActiveTab('finance')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#7c6c72', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                Untung Bersih (Profit Sah) 💖
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.3rem', color: '#2b9348' }}>
                RM {totalProfit.toFixed(2)}
              </h2>
            </div>
            <div style={{ padding: '0.7rem', borderRadius: '16px', background: '#e8fccf', color: '#2b9348' }}>
              <TrendingUp size={26} />
            </div>
          </div>
          <div style={{ marginTop: '0.8rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Keuntungan margin bersih disahkan.
          </div>
        </div>
      </div>

      {/* Secondary Inventory Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.1rem 1.3rem', cursor: 'pointer' }} onClick={() => setActiveTab('stock')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '14px', background: '#e7c6ff' }}>
              <Tag size={22} color="#7209b7" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Jumlah Jenis</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#7209b7' }}>{totalProducts} Items</div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.1rem 1.3rem', cursor: 'pointer' }} onClick={() => setActiveTab('stock')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '14px', background: 'var(--success-bg)' }}>
              <PackageCheck size={22} color="#2b9348" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Ada Stok 🌸</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#2b9348' }}>{inStockProducts.length} Items</div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.1rem 1.3rem', cursor: 'pointer' }} onClick={() => setActiveTab('stock')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '14px', background: 'var(--warning-bg)' }}>
              <AlertTriangle size={22} color="#d97706" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Stok Amaran ⚠️</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#d97706' }}>{lowStockProducts.length} Items</div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.1rem 1.3rem', cursor: 'pointer' }} onClick={() => setActiveTab('stock')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '14px', background: 'var(--danger-bg)' }}>
              <Heart size={22} color="#ff124f" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Sold Out 🎀</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ff124f' }}>{soldOutProducts.length} Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Transactions Section */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={22} color="#ff4d6d" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Transaksi Terkini ✨</h3>
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => setActiveTab('finance')}
          >
            Lihat Rekod Kewangan 💸
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Status & Jenis Transaksi</th>
                <th>Nama Produk</th>
                <th>Kuantiti</th>
                <th>Harga / Unit</th>
                <th>Jumlah (RM)</th>
                <th>Rujukan / Pihak</th>
                <th>Tarikh & Masa</th>
              </tr>
            </thead>
            <tbody>
              {latestTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontWeight: '600' }}>
                    Tiada rekod transaksi lagi 🌸
                  </td>
                </tr>
              ) : (
                latestTransactions.map((tx) => {
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
                            {isOut ? 'Jualan (Disahkan)' : 'Stock In (Restock)'}
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: '700', color: '#33272a' }}>{tx.productName}</td>
                      <td style={{ fontWeight: '700' }}>
                        {isOut ? `-${tx.quantity}` : `+${tx.quantity}`} unit
                      </td>
                      <td>RM {Number(tx.unitPrice).toFixed(2)}</td>
                      <td style={{ fontWeight: '800', color: isOut ? '#2b9348' : '#d97706' }}>
                        {isOut ? '+' : '-'} RM {Number(tx.totalAmount).toFixed(2)}
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{tx.party || tx.reference || '-'}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        {new Date(tx.timestamp).toLocaleString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
