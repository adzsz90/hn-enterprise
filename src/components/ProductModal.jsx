import React, { useState, useEffect } from 'react';
import { X, Save, Package, Upload, Check } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSave, productToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    sizes: ['M'], // Multi-select sizes array
    color: '',
    costPrice: '',
    sellingPrice: '',
    discountPrice: '',
    stock: '',
    minStock: '5',
    image: '/images/oversized_graphic_tee.jpg',
    description: ''
  });

  const [imagePreview, setImagePreview] = useState('/images/oversized_graphic_tee.jpg');

  const availableSizesList = ['S', 'M', 'L', 'XL', 'XXL', 'FREE SIZE'];

  useEffect(() => {
    if (productToEdit) {
      const img = productToEdit.image || '/images/oversized_graphic_tee.jpg';
      // Parse sizes string into array or default to ['M']
      const existingSizes = productToEdit.size 
        ? productToEdit.size.split(',').map(s => s.trim()) 
        : ['M'];

      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || '',
        sku: productToEdit.sku || '',
        sizes: existingSizes,
        color: productToEdit.color || '',
        costPrice: productToEdit.costPrice ?? '',
        sellingPrice: productToEdit.sellingPrice ?? '',
        discountPrice: productToEdit.discountPrice ?? '',
        stock: productToEdit.stock ?? '',
        minStock: productToEdit.minStock ?? '5',
        image: img,
        description: productToEdit.description || ''
      });
      setImagePreview(img);
    } else {
      const autoSKU = `HNE-${Math.floor(100 + Math.random() * 900)}`;
      const defaultImg = '/images/oversized_graphic_tee.jpg';
      setFormData({
        name: '',
        category: '',
        sku: autoSKU,
        sizes: ['M'],
        color: '',
        costPrice: '',
        sellingPrice: '',
        discountPrice: '',
        stock: '0',
        minStock: '5',
        image: defaultImg,
        description: ''
      });
      setImagePreview(defaultImg);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload (converts to base64 Data URL)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Saiz gambar terlalu besar! Sila pilih gambar bersaiz di bawah 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setFormData(prev => ({ ...prev, image: result }));
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle multi-select size
  const toggleSize = (sz) => {
    setFormData(prev => {
      const currentSizes = [...prev.sizes];
      if (currentSizes.includes(sz)) {
        // Prevent empty array
        if (currentSizes.length === 1) return prev;
        return { ...prev, sizes: currentSizes.filter(s => s !== sz) };
      } else {
        return { ...prev, sizes: [...currentSizes, sz] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.costPrice || !formData.sellingPrice) {
      alert("Sila lengkapkan Nama Produk, Harga Kos, dan Harga Jualan!");
      return;
    }

    const sellP = parseFloat(formData.sellingPrice) || 0;
    const discP = formData.discountPrice ? parseFloat(formData.discountPrice) : null;
    const formattedCategory = formData.category.trim() || 'Umum';
    const formattedSize = formData.sizes.join(', ');

    onSave({
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name: formData.name.trim(),
      category: formattedCategory,
      sku: formData.sku.trim() || `HNE-${Date.now()}`,
      size: formattedSize,
      color: formData.color.trim(),
      costPrice: parseFloat(formData.costPrice) || 0,
      sellingPrice: sellP,
      discountPrice: discP,
      stock: parseInt(formData.stock, 10) || 0,
      minStock: parseInt(formData.minStock, 10) || 5,
      image: formData.image || '/images/oversized_graphic_tee.jpg',
      description: formData.description.trim(),
      createdAt: productToEdit ? productToEdit.createdAt : new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package size={22} color="#ff4d6d" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              {productToEdit ? 'Edit Maklumat Produk' : 'Tambah Stok / Baju Baru 👚'}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Clean Image Upload Section (Single Upload Button Only) */}
          <div style={{ 
            background: '#fff5f7', 
            border: '2px dashed #ffccd5', 
            borderRadius: 'var(--radius-md)', 
            padding: '1rem',
            marginBottom: '1.2rem'
          }}>
            <label style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '0.88rem', color: '#ff4d6d', display: 'block', marginBottom: '0.6rem' }}>
              🖼️ Gambar Pakaian (Product Image)
            </label>

            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              {/* Thumbnail Preview Box */}
              <div style={{ 
                width: '80px', 
                height: '105px', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                border: '2px solid #ff85a1', 
                background: '#ffffff',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(255, 133, 161, 0.25)'
              }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Single Clean Upload Button */}
              <div style={{ flex: 1 }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  id="apparel-file-input"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="apparel-file-input" 
                  className="btn btn-primary"
                  style={{ 
                    cursor: 'pointer', 
                    borderRadius: 'var(--radius-full)',
                    padding: '0.65rem 1.2rem',
                    fontSize: '0.88rem'
                  }}
                >
                  <Upload size={16} />
                  <span>Muat Naik Gambar (JPG / PNG)</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.4rem', fontWeight: '600' }}>
                  Tekan butang di atas untuk memilih gambar dari peranti anda.
                </span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Nama Produk / Apparel *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="Contoh: HN Premium Oversized Graphic Tee" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Kategori Produk (Tulis Manual) *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Cth: T-Shirt, Hoodie, Pants..." 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Kod SKU / Barcode</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="HNE-TS-001" 
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
          </div>

          {/* Multi-Select Sizes Selection */}
          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Pilihan Saiz (Boleh pilih lebih dari satu) *</span>
              <span style={{ fontSize: '0.78rem', color: '#ff4d6d', fontWeight: '700' }}>
                Dipilih: {formData.sizes.join(', ')}
              </span>
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
              {availableSizesList.map(sz => {
                const isSelected = formData.sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    style={{
                      border: isSelected ? '2px solid #ff4d6d' : '2px solid var(--border-color)',
                      background: isSelected ? '#ffe5ec' : '#ffffff',
                      color: isSelected ? '#ff124f' : 'var(--text-main)',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected && <Check size={13} color="#ff124f" />}
                    <span>{sz}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label>Warna / Variation (Asingkan dengan koma untuk pelbagai warna)</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="Cth: HITAM, MERAH, COKLAT" 
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label>Harga Kos (RM) *</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                className="form-control"
                placeholder="25.00" 
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Harga Jualan (RM) *</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                className="form-control"
                placeholder="69.00" 
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Harga Diskaun (RM)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                className="form-control"
                placeholder="49.00 (Optional)" 
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Bilangan Stok</label>
              <input 
                type="number" 
                min="0"
                className="form-control"
                placeholder="0" 
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Paras Stok Amaran (Low Threshold)</label>
              <input 
                type="number" 
                min="1"
                className="form-control"
                placeholder="5" 
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Keterangan Tambahan / Fabric Specs</label>
            <textarea 
              className="form-control"
              rows="2"
              placeholder="Cth: 100% Cotton 240gsm, Microfiber, Ripstop..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Simpan Maklumat Produk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
