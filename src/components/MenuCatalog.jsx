import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  AlertCircle,
  CheckCircle2,
  Heart,
  Sparkles,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Upload
} from 'lucide-react';

export default function MenuCatalog({ 
  products, 
  onOpenProductModal, 
  onDeleteProduct 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Extract unique categories
  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.color && product.color.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;

    let matchesStatus = true;
    if (selectedStatus === 'IN_STOCK') matchesStatus = product.stock > (product.minStock || 5);
    else if (selectedStatus === 'LOW_STOCK') matchesStatus = product.stock > 0 && product.stock <= (product.minStock || 5);
    else if (selectedStatus === 'SOLD_OUT') matchesStatus = product.stock === 0;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* PrettyLittleThing Header Bar */}
      <div style={{ 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem',
        borderBottom: '2px solid #f0e6e1',
        paddingBottom: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.15em', color: '#ff4d6d', textTransform: 'uppercase' }}>
            LOOKBOOK & CATALOG MENU
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: '700', fontFamily: 'var(--font-heading)', marginTop: '0.1rem' }}>
            Bahagian Menu Katalog 👚
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem', fontWeight: '600' }}>
            Katalog produk pakaian, gambar fesyen, maklumat harga, saiz, dan variasi warna.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* View Mode Switcher */}
          <div style={{ 
            display: 'flex', 
            background: '#ffffff', 
            border: '2px solid var(--border-color)', 
            borderRadius: 'var(--radius-full)', 
            padding: '3px' 
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                border: 'none',
                background: viewMode === 'grid' ? '#ff4d6d' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-muted)',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <LayoutGrid size={15} /> Grid Lookbook
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                border: 'none',
                background: viewMode === 'table' ? '#ff4d6d' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : 'var(--text-muted)',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <List size={15} /> Senarai Jadual
            </button>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={() => onOpenProductModal()}
          >
            <Plus size={18} />
            <span>+ Tambah Pakaian / Gambar Baru 👚</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '700', color: '#33272a' }}>
              <SlidersHorizontal size={16} color="#ff4d6d" />
              <span>TAPIS KATALOG:</span>
            </div>

            {/* Category Dropdown Filter */}
            <div>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ 
                  padding: '0.45rem 2.2rem 0.45rem 0.9rem', 
                  borderRadius: 'var(--radius-full)', 
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  border: '2px solid #ffccd5',
                  background: '#fffafb'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'ALL' ? 'KATEGORI: SEMUA' : `KATEGORI: ${cat.toUpperCase()}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Status Filter */}
            <div>
              <select
                className="form-control"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ 
                  padding: '0.45rem 2.2rem 0.45rem 0.9rem', 
                  borderRadius: 'var(--radius-full)', 
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  border: '2px solid #ffccd5',
                  background: '#fffafb'
                }}
              >
                <option value="ALL">STATUS STOK: SEMUA</option>
                <option value="IN_STOCK">🌸 ADA STOK (IN STOCK)</option>
                <option value="LOW_STOCK">⚠️ STOK AMARAN (LOW)</option>
                <option value="SOLD_OUT">🎀 SOLD OUT (HABIS)</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Cari baju / SKU / warna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                paddingLeft: '2.3rem', 
                paddingTop: '0.45rem', 
                paddingBottom: '0.45rem', 
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem' 
              }}
            />
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>
      </div>

      {/* PrettyLittleThing Lookbook Grid View */}
      {viewMode === 'grid' ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '2px dashed #ffccd5' }}>
              <Package size={44} color="#ff4d6d" style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ff4d6d' }}>Tiada baju dijumpai dalam katalog 🌸</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Sila tambah pakaian baru atau tukar carian.</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isSoldOut = product.stock === 0;
              const isLowStock = product.stock > 0 && product.stock <= (product.minStock || 5);
              const marginRM = (product.sellingPrice || 0) - (product.costPrice || 0);

              const imageSrc = product.image || '/images/oversized_graphic_tee.jpg';

              return (
                <div 
                  key={product.id} 
                  style={{
                    background: '#ffffff',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                    position: 'relative'
                  }}
                >
                  {/* Photo Frame (PrettyLittleThing 3:4 Aspect Ratio) */}
                  <div style={{ 
                    position: 'relative', 
                    width: '100%', 
                    paddingTop: '133%',
                    overflow: 'hidden',
                    background: '#fff0f3' 
                  }}>
                    <img 
                      src={imageSrc} 
                      alt={product.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isSoldOut ? 'grayscale(70%) opacity(0.7)' : 'none'
                      }}
                    />

                    {/* Status Badge Overlaid on Image */}
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                      {isSoldOut ? (
                        <span className="badge badge-sold-out" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
                          <Heart size={12} fill="#ff124f" /> SOLD OUT 🎀
                        </span>
                      ) : isLowStock ? (
                        <span className="badge badge-low-stock" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
                          <AlertCircle size={12} /> LOW STOCK ⚠️
                        </span>
                      ) : (
                        <span style={{ 
                          background: 'rgba(255, 255, 255, 0.92)', 
                          color: '#33272a', 
                          fontSize: '0.72rem', 
                          fontWeight: '800', 
                          letterSpacing: '0.08em',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}>
                          IN DEMAND
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.3rem' }}>
                        <span>{product.category.toUpperCase()}</span>
                        <span style={{ color: '#ff4d6d' }}>{product.sku}</span>
                      </div>

                      <h4 style={{ 
                        fontSize: '0.92rem', 
                        fontWeight: '700', 
                        textTransform: 'uppercase', 
                        lineHeight: '1.3',
                        color: isSoldOut ? '#888' : '#2b1e22',
                        marginBottom: '0.4rem'
                      }}>
                        {product.name}
                      </h4>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.6rem' }}>
                        SAIZ: <span style={{ color: '#ff4d6d', fontWeight: '700' }}>{product.size || '-'}</span> • WARNA: {product.color || 'STANDARD'}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ff124f', fontFamily: 'var(--font-heading)' }}>
                          RM {Number(product.sellingPrice).toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span style={{ fontSize: '0.85rem', color: '#a899a0', textDecoration: 'line-through', fontWeight: '600' }}>
                            RM {Number(product.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div style={{ 
                        background: '#fff5f7', 
                        padding: '0.5rem 0.75rem', 
                        borderRadius: 'var(--radius-sm)', 
                        fontSize: '0.78rem',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Baki Stok: </span>
                          <strong style={{ color: isSoldOut ? '#ff124f' : isLowStock ? '#d97706' : '#2b9348', fontSize: '0.9rem' }}>
                            {product.stock} unit
                          </strong>
                        </div>
                        <div style={{ color: '#2b9348', fontWeight: '700' }}>
                          +RM {marginRM.toFixed(2)} Untung
                        </div>
                      </div>
                    </div>

                    {/* Card Actions (Edit & Delete) */}
                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px dashed #f0e6e1', paddingTop: '0.75rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onOpenProductModal(product)}
                        style={{ flex: 1 }}
                      >
                        <Edit3 size={14} /> Edit Pakaian
                      </button>

                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onDeleteProduct(product.id)}
                        style={{ color: '#ff4d6d' }}
                        title="Padam"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Status Stok</th>
                  <th>SKU</th>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Saiz & Warna</th>
                  <th>Kos Beli (RM)</th>
                  <th>Harga Jual (RM)</th>
                  <th>Baki Stok</th>
                  <th style={{ textAlign: 'right' }}>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isSoldOut = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock <= (product.minStock || 5);

                  return (
                    <tr key={product.id}>
                      <td>
                        {isSoldOut ? (
                          <span className="badge badge-sold-out"><Heart size={12} fill="#ff124f" /> SOLD OUT</span>
                        ) : isLowStock ? (
                          <span className="badge badge-low-stock"><AlertCircle size={12} /> LOW STOCK</span>
                        ) : (
                          <span className="badge badge-in-stock"><CheckCircle2 size={12} /> ADA STOK</span>
                        )}
                      </td>
                      <td style={{ fontFamily: 'var(--font-heading)', color: '#ff4d6d', fontWeight: '600' }}>{product.sku}</td>
                      <td style={{ fontWeight: '700', color: '#2b1e22' }}>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.size} / {product.color}</td>
                      <td>RM {Number(product.costPrice).toFixed(2)}</td>
                      <td style={{ fontWeight: '700', color: '#ff4d6d' }}>
                        RM {Number(product.sellingPrice).toFixed(2)}
                      </td>
                      <td style={{ fontWeight: '800', color: isSoldOut ? '#ff124f' : '#2b9348' }}>{product.stock} unit</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => onOpenProductModal(product)}>
                            <Edit3 size={14} /> Edit
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => onDeleteProduct(product.id)} style={{ color: '#ff4d6d' }}>
                            <Trash2 size={14} /> Padam
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
      )}
    </div>
  );
}
