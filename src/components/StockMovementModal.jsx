import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, DollarSign, Truck, ShoppingCart } from 'lucide-react';

export default function StockMovementModal({ 
  isOpen, 
  onClose, 
  movementType, // 'STOCK_IN' or 'STOCK_OUT'
  selectedProduct, 
  products, 
  onAddTransaction 
}) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('');
  const [party, setParty] = useState('');
  const [reference, setReference] = useState('');

  const isStockOut = movementType === 'STOCK_OUT';

  useEffect(() => {
    if (selectedProduct) {
      setProductId(selectedProduct.id);
      setUnitPrice(isStockOut ? selectedProduct.sellingPrice : selectedProduct.costPrice);
    } else if (products.length > 0) {
      setProductId(products[0].id);
      setUnitPrice(isStockOut ? products[0].sellingPrice : products[0].costPrice);
    }
    setQuantity('1');
    setParty(isStockOut ? 'Pelanggan Walk-in / Online' : 'Pembekal Tekstil');
    setReference(isStockOut ? `INV-${Math.floor(1000 + Math.random() * 9000)}` : `PO-${Math.floor(1000 + Math.random() * 9000)}`);
  }, [selectedProduct, movementType, isOpen]);

  // Handle product selection change
  const handleProductChange = (e) => {
    const id = e.target.value;
    setProductId(id);
    const prod = products.find(p => p.id === id);
    if (prod) {
      setUnitPrice(isStockOut ? prod.sellingPrice : prod.costPrice);
    }
  };

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === productId);

  const numQty = parseInt(quantity, 10) || 0;
  const numPrice = parseFloat(unitPrice) || 0;
  const totalAmount = numQty * numPrice;

  // Calculate profit for stock out
  const costPrice = currentProduct ? (currentProduct.costPrice || 0) : 0;
  const calculatedProfit = isStockOut ? (numPrice - costPrice) * numQty : 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentProduct) {
      alert("Sila pilih produk!");
      return;
    }

    if (numQty <= 0) {
      alert("Kuantiti mesti lebih daripada 0!");
      return;
    }

    if (isStockOut && numQty > currentProduct.stock) {
      alert(`Stok tidak mencukupi! Baki stok semasa hanya ${currentProduct.stock} unit.`);
      return;
    }

    onAddTransaction({
      id: `tx-${Date.now()}`,
      type: movementType,
      productId: currentProduct.id,
      productName: currentProduct.name,
      quantity: numQty,
      unitPrice: numPrice,
      totalAmount: totalAmount,
      profit: calculatedProfit,
      party: party.trim(),
      reference: reference.trim(),
      timestamp: new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isStockOut ? (
              <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--success-bg)', color: '#34d399' }}>
                <ArrowUpRight size={22} />
              </div>
            ) : (
              <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: '#8b5cf6' }}>
                <ArrowDownLeft size={22} />
              </div>
            )}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              {isStockOut ? 'Rekod Jualan / Perolehan (Stock Out)' : 'Rekod Pembelian Stok (Stock In / Restock)'}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pilih Produk Apparel / Barangan *</label>
            <select 
              className="form-control"
              value={productId}
              onChange={handleProductChange}
              required
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — Stok Semasa: {p.stock} unit {p.stock === 0 ? '[SOLD OUT]' : ''}
                </option>
              ))}
            </select>
          </div>

          {currentProduct && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.04)', 
              padding: '0.8rem 1rem', 
              borderRadius: '8px', 
              marginBottom: '1.2rem',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status Stok: </span>
                <strong style={{ color: currentProduct.stock === 0 ? '#f87171' : '#34d399' }}>
                  {currentProduct.stock === 0 ? 'SOLD OUT (0 unit)' : `${currentProduct.stock} unit tersedia`}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Kos Asal: </span>
                <strong>RM {Number(currentProduct.costPrice).toFixed(2)}</strong>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Kuantiti (Unit) *</label>
              <input 
                type="number"
                min="1"
                max={isStockOut && currentProduct ? currentProduct.stock : 99999}
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>{isStockOut ? 'Harga Jualan Seunit (RM) *' : 'Kos Pembelian Seunit (RM) *'}</label>
              <input 
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>{isStockOut ? 'Saluran / Pelanggan' : 'Pembekal / Supplier'}</label>
              <input 
                type="text"
                className="form-control"
                placeholder={isStockOut ? "Cth: Shopee / Walk-in" : "Cth: Kilang Apparel Melaka"}
                value={party}
                onChange={(e) => setParty(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>No. Rujukan / Invois / PO</label>
              <input 
                type="text"
                className="form-control"
                placeholder="INV-001 / PO-99"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>

          {/* Calculation Summary Box */}
          <div style={{ 
            background: isStockOut ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)', 
            border: `1px solid ${isStockOut ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            marginTop: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {isStockOut ? 'Jumlah Perolehan Jualan:' : 'Jumlah Kos Pembelian:'}
              </span>
              <strong style={{ fontSize: '1.2rem', color: isStockOut ? '#34d399' : '#8b5cf6' }}>
                RM {totalAmount.toFixed(2)}
              </strong>
            </div>
            {isStockOut && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Anggaran Untung Bersih:</span>
                <span style={{ color: '#10b981', fontWeight: '700' }}>
                  +RM {calculatedProfit.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button 
              type="submit" 
              className={`btn ${isStockOut ? 'btn-success' : 'btn-primary'}`}
            >
              {isStockOut ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
              <span>{isStockOut ? 'Sahkan Rekod Jualan' : 'Sahkan Rekod Restock'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
