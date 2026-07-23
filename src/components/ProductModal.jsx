import React, { useState, useEffect } from 'react';
import { X, Save, Package, Upload, Check, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSave, productToEdit }) {
  const availableSizesList = ['S', 'M', 'L', 'XL', 'XXL', 'FREE SIZE'];

  // Global Main Product Info
  const [productName, setProductName] = useState('');
  const [collectionCategory, setCollectionCategory] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [coverImage, setCoverImage] = useState('/images/jubah_plain_parasha.jpg');

  // Variants list (Each variant has its own Image, Color/Variant Name, Size Pills, Selling Price, Cost Price, Stock)
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (productToEdit) {
      const existingSizes = productToEdit.size 
        ? productToEdit.size.split(',').map(s => s.trim()) 
        : ['FREE SIZE'];

      setProductName(productToEdit.name || '');
      setCollectionCategory(productToEdit.category || 'Jubah');
      setCollectionDescription(productToEdit.description || '');
      setCoverImage(productToEdit.image || '/images/jubah_plain_parasha.jpg');

      setVariants([{
        id: productToEdit.id,
        color: productToEdit.color || 'Standard',
        sizes: existingSizes,
        costPrice: productToEdit.costPrice ?? '25',
        sellingPrice: productToEdit.sellingPrice ?? '49',
        discountPrice: productToEdit.discountPrice ?? '',
        stock: productToEdit.stock ?? '15',
        image: productToEdit.image || '/images/jubah_plain_parasha.jpg'
      }]);
    } else {
      setProductName('Jubah Plain Parasha');
      setCollectionCategory('Jubah');
      setCollectionDescription('Fabric Premium High Quality Ironless, Cutting A-Cut Selesa');
      setCoverImage('/images/jubah_plain_parasha.jpg');

      // Default 1 fresh variant template
      setVariants([{
        id: `prod-${Date.now()}-1`,
        color: 'Ungu Biru Pink',
        sizes: ['S'],
        costPrice: '25',
        sellingPrice: '49',
        discountPrice: '',
        stock: '15',
        image: '/images/jubah_plain_parasha.jpg'
      }]);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Add a new variant entry
  const handleAddVariant = () => {
    const newId = `prod-${Date.now()}-${variants.length + 1}`;
    setVariants(prev => [
      ...prev,
      {
        id: newId,
        color: '',
        sizes: ['FREE SIZE'],
        costPrice: '25',
        sellingPrice: '49',
        discountPrice: '',
        stock: '15',
        image: '/images/jubah_plain_parasha.jpg'
      }
    ]);
  };

  // Remove a variant entry
  const handleRemoveVariant = (index) => {
    if (variants.length === 1) {
      alert("Sekurang-kurangnya 1 variasi warna & saiz diperlukan.");
      return;
    }
    setVariants(prev => prev.filter((_, idx) => idx !== index));
  };

  // Update specific field inside a variant
  const handleUpdateVariant = (index, field, value) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handle local image file upload per variant (converts to base64 Data URL)
  const handleVariantFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Saiz gambar terlalu besar! Sila pilih gambar bersaiz di bawah 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateVariant(index, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle size for a specific variant
  const toggleVariantSize = (variantIndex, sz) => {
    setVariants(prev => {
      const updated = [...prev];
      const targetVar = updated[variantIndex];
      const currentSizes = [...targetVar.sizes];
      
      let newSizes;
      if (currentSizes.includes(sz)) {
        if (currentSizes.length === 1) return prev; // Keep at least 1 size
        newSizes = currentSizes.filter(s => s !== sz);
      } else {
        newSizes = [...currentSizes, sz];
      }

      updated[variantIndex] = { ...targetVar, sizes: newSizes };
      return updated;
    });
  };

  // Submit all variants to onSave
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productName.trim()) {
      alert("Sila isi Nama Produk Utama!");
      return;
    }

    // Validate variants
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.sellingPrice) {
        alert(`Sila isi Harga Jualan bagi Variasi #${i + 1}!`);
        return;
      }
    }

    const mainName = productName.trim();
    const categoryFormatted = collectionCategory.trim() || 'Jubah';

    const savedProducts = variants.map((v, idx) => {
      const variantLabel = v.color.trim() ? v.color.trim() : `Variasi ${idx + 1}`;
      const fullName = variants.length > 1 ? `${mainName} (${variantLabel})` : mainName;

      return {
        id: v.id,
        name: fullName,
        category: categoryFormatted,
        sku: `HNE-${Math.floor(100 + Math.random() * 900)}`,
        size: v.sizes.join(', '),
        color: variantLabel,
        costPrice: parseFloat(v.costPrice) || 0,
        sellingPrice: parseFloat(v.sellingPrice) || 0,
        discountPrice: v.discountPrice ? parseFloat(v.discountPrice) : null,
        stock: parseInt(v.stock, 10) || 0,
        minStock: 3,
        image: v.image || coverImage || '/images/jubah_plain_parasha.jpg',
        description: collectionDescription.trim() || `Produk ${fullName}`,
        createdAt: productToEdit ? productToEdit.createdAt : new Date().toISOString()
      };
    });

    onSave(savedProducts);
    onClose();
  };

  // Handle Cover Image Upload
  const handleCoverFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Saiz gambar terlalu besar! Sila pilih gambar bersaiz di bawah 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '660px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package size={22} color="#ff4d6d" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              {productToEdit ? 'Edit Maklumat Produk' : 'Tambah Stok & Gambar Baharu 👚'}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main Product Info Header */}
          <div style={{ background: '#fff0f3', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.2rem', border: '1px solid #ffccd5' }}>
            {/* Cover Image Upload (Gambar Depan Utama Menu) */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.85rem', background: '#ffffff', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px dashed #ff85a1' }}>
              <div style={{ position: 'relative', width: '60px', height: '75px', borderRadius: '6px', overflow: 'hidden', border: '1.5px solid #ff4d6d', flexShrink: 0 }}>
                <img src={coverImage} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ff4d6d', display: 'block' }}>
                  🖼️ Gambar Depan Utama (Cover Storefront Menu)
                </label>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Gambar muka depan menu (tidak mempengaruhi gambar-gambar variasi stok di bawah).
                </span>
                <label className="btn btn-secondary btn-sm" style={{ fontSize: '0.76rem', padding: '0.3rem 0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', borderColor: '#ff85a1', color: '#ff4d6d' }}>
                  <Upload size={13} /> Pilih Gambar Depan Utama
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleCoverFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ff124f' }}>Nama Produk Utama *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Contoh: Jubah Plain Parasha"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                style={{ fontWeight: '700', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Kategori Produk</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Contoh: Jubah"
                  value={collectionCategory}
                  onChange={(e) => setCollectionCategory(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Penerangan Ringkas</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Contoh: Fabric Premium High Quality Ironless"
                  value={collectionDescription}
                  onChange={(e) => setCollectionDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section Header for Multi-Variants */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '2px solid #ffe5ec', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#ff4d6d', fontFamily: 'var(--font-heading)' }}>
              🖼️ Variasi Warna, Gambar, Saiz & Harga ({variants.length})
            </h3>
            
            {!productToEdit && (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleAddVariant}
                style={{ borderColor: '#ff85a1', color: '#ff4d6d', background: '#fff0f3', borderRadius: 'var(--radius-full)' }}
              >
                <Plus size={16} /> + Tambah Gambar / Variasi Warna 📸
              </button>
            )}
          </div>

          {/* Render Each Variant Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.4rem' }}>
            {variants.map((v, idx) => (
              <div 
                key={v.id} 
                style={{ 
                  background: '#ffffff', 
                  border: '1.5px solid #ffccd5', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '0.9rem',
                  position: 'relative',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', background: '#ff4d6d', color: '#ffffff', padding: '0.18rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                    Item Variasi #{idx + 1}
                  </span>

                  {variants.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveVariant(idx)}
                      style={{ background: 'none', border: 'none', color: '#ff4d6d', cursor: 'pointer', padding: '0.2rem' }}
                      title="Padam variasi ini"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '1rem', alignItems: 'start' }}>
                  {/* Single Upload Button & Image Preview per Variant */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '110px', height: '135px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #ff85a1', marginBottom: '0.4rem', background: '#fff0f3' }}>
                      <img src={v.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <label className="btn btn-secondary btn-sm" style={{ width: '100%', fontSize: '0.74rem', padding: '0.35rem 0.2rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                      <Upload size={13} /> Upload Gambar
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleVariantFileUpload(idx, e)}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  {/* Variant Details Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: '700' }}>Warna / Variasi *</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="Contoh: Ungu Biru Pink / Nude / Emerald Green"
                        value={v.color}
                        onChange={(e) => handleUpdateVariant(idx, 'color', e.target.value)}
                        required
                      />
                    </div>

                    {/* Price & Stock Inputs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.45rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.76rem', fontWeight: '700' }}>Harga Jualan (RM) *</label>
                        <input 
                          type="number" 
                          step="0.01"
                          className="form-control"
                          placeholder="49.00"
                          value={v.sellingPrice}
                          onChange={(e) => handleUpdateVariant(idx, 'sellingPrice', e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.76rem', fontWeight: '700' }}>Harga Kos (RM)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          className="form-control"
                          placeholder="25.00"
                          value={v.costPrice}
                          onChange={(e) => handleUpdateVariant(idx, 'costPrice', e.target.value)}
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.76rem', fontWeight: '700' }}>Stok Unit *</label>
                        <input 
                          type="number" 
                          className="form-control"
                          placeholder="15"
                          value={v.stock}
                          onChange={(e) => handleUpdateVariant(idx, 'stock', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Size Selector Pills for this variant */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: '700' }}>Saiz Tersedia Bagi Gambar Stok Ini *</label>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                        {availableSizesList.map(sz => {
                          const isSelected = v.sizes.includes(sz);
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => toggleVariantSize(idx, sz)}
                              style={{
                                border: isSelected ? '2px solid #ff4d6d' : '1px solid var(--border-color)',
                                background: isSelected ? '#ff4d6d' : '#ffffff',
                                color: isSelected ? '#ffffff' : 'var(--text-main)',
                                padding: '0.22rem 0.6rem',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              {isSelected && <Check size={11} style={{ marginRight: '2px' }} />}
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!productToEdit && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleAddVariant}
              style={{ width: '100%', marginBottom: '1.2rem', borderColor: '#ffccd5', color: '#ff4d6d', background: '#fff5f7' }}
            >
              <Plus size={18} /> + Tambah Gambar & Variasi Stok Baharu 📸
            </button>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              <span>Simpan Semua ({variants.length}) Variasi Stok 💾</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
