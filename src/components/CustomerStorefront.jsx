import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Lock, 
  Check, 
  X,
  ShieldCheck,
  Package,
  MessageCircle,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowLeft,
  ZoomIn
} from 'lucide-react';

export default function CustomerStorefront({ 
  products, 
  onOpenAdminLogin, 
  isAdminLoggedIn, 
  onGoToAdminPanel,
  onCustomerPurchase 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Shopping Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fullscreen Image Lightbox State
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Single Product Checkout / Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerChannel, setCustomerChannel] = useState('Web Storefront');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState(false);

  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.color && product.color.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group products into single collections (strips brackets e.g. "Jubah Plain Parasha (Ungu)" -> "Jubah Plain Parasha")
  const groupedCollections = React.useMemo(() => {
    const map = new Map();

    filteredProducts.forEach(item => {
      const cleanName = item.name.replace(/\s*\([^)]*\)/g, '').trim() || item.name;
      if (!map.has(cleanName)) {
        map.set(cleanName, {
          groupId: `group-${cleanName}`,
          mainName: cleanName,
          category: item.category,
          description: item.description,
          coverImage: item.image || '/images/jubah_plain_parasha.jpg',
          variants: [item]
        });
      } else {
        const grp = map.get(cleanName);
        grp.variants.push(item);
        if (!grp.coverImage && item.image) grp.coverImage = item.image;
      }
    });

    return Array.from(map.values());
  }, [filteredProducts]);

  // Group modal state
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Open Product Modal for a grouped collection
  const handleOpenGroupBuyModal = (group) => {
    if (!group || !group.variants || group.variants.length === 0) return;
    const firstVariant = group.variants[0];
    setSelectedGroup(group);
    setSelectedProduct(firstVariant);
    setPurchaseQty(1);
    setOrderSuccessMsg(false);

    const sizes = firstVariant.size ? firstVariant.size.split(',').map(s => s.trim()).filter(Boolean) : ['FREE SIZE'];
    setSelectedSize(sizes[0] || 'FREE SIZE');

    const colorLabel = firstVariant.color || firstVariant.name || 'Standard';
    setSelectedColor(colorLabel);
  };

  // Switch variant inside grouped purchase modal
  const handleSelectVariantInGroup = (variant) => {
    setSelectedProduct(variant);
    const sizes = variant.size ? variant.size.split(',').map(s => s.trim()).filter(Boolean) : ['FREE SIZE'];
    setSelectedSize(sizes[0] || 'FREE SIZE');
    const colorLabel = variant.color || variant.name || 'Standard';
    setSelectedColor(colorLabel);
  };

  // Resolve color specific image dynamically
  const resolveColorImage = (product, color) => {
    if (!product) return '/images/jubah_plain_parasha.jpg';
    if (product.colorImages && color && product.colorImages[color]) {
      return product.colorImages[color];
    }
    if (color) {
      const normColor = color.toUpperCase();
      if (normColor.includes('GREEN') || normColor.includes('EMERALD') || normColor.includes('HIJAU')) {
        return '/images/jubah_plain_parasha_green.png';
      }
      if (normColor.includes('MAROON') || normColor.includes('RED') || normColor.includes('MERAH')) {
        return '/images/jubah_plain_parasha_maroon.png';
      }
      if (normColor.includes('UNGU') || normColor.includes('BIRU') || normColor.includes('BLUE') || normColor.includes('NUDE') || normColor.includes('BEIGE')) {
        return '/images/jubah_plain_parasha_blue_purple_nude.png';
      }
      if (normColor.includes('PINK') || normColor.includes('PURPLE') || normColor.includes('DUSTY')) {
        return '/images/jubah_plain_parasha_green_pink_maroon.png';
      }
    }
    return product.image || '/images/jubah_plain_parasha.jpg';
  };

  // Add Item To Cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    if (purchaseQty > selectedProduct.stock) {
      alert(`Maaf, baki stok hanya ${selectedProduct.stock} unit tersedia.`);
      return;
    }

    const unitSell = (selectedProduct.discountPrice && selectedProduct.discountPrice > 0) 
      ? selectedProduct.discountPrice 
      : (selectedProduct.sellingPrice || 0);

    const activeImage = resolveColorImage(selectedProduct, selectedColor);

    const newItem = {
      cartId: `cart-${Date.now()}-${Math.random()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      image: activeImage,
      size: selectedSize,
      color: selectedColor,
      quantity: purchaseQty,
      unitPrice: unitSell,
      costPrice: selectedProduct.costPrice || 0,
      stock: selectedProduct.stock
    };

    setCart(prev => [...prev, newItem]);
    setSelectedProduct(null);
    setIsCartOpen(true); // Open cart to confirm addition
  };

  // Complete Single Direct Order (Sends Order to WhatsApp Ika: 0146434889)
  const handleCompleteSingleOrder = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (purchaseQty > selectedProduct.stock) {
      alert(`Maaf, baki stok hanya ${selectedProduct.stock} unit tersedia.`);
      return;
    }

    const unitSell = (selectedProduct.discountPrice && selectedProduct.discountPrice > 0) 
      ? selectedProduct.discountPrice 
      : (selectedProduct.sellingPrice || 0);

    const unitCost = selectedProduct.costPrice || 0;
    const totalAmount = unitSell * purchaseQty;
    const profit = (unitSell - unitCost) * purchaseQty;
    const refId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const cName = customerName.trim() || 'Pelanggan Storefront';

    // 1. Log transaction to Admin system
    onCustomerPurchase({
      id: `tx-${Date.now()}`,
      type: 'STOCK_OUT',
      productId: selectedProduct.id,
      productName: `${selectedProduct.name} [${selectedSize} / ${selectedColor}]`,
      quantity: purchaseQty,
      unitPrice: unitSell,
      totalAmount: totalAmount,
      profit: profit,
      party: `Pelanggan: ${cName}`,
      reference: refId,
      timestamp: new Date().toISOString()
    });

    // 2. Format WhatsApp Order Message
    let waMessage = `*PESANAN BAHARU - HN ENTERPRISE 💕*\n\n`;
    waMessage += `*Nama Pelanggan:* ${cName}\n`;
    waMessage += `*No. Rujukan:* ${refId}\n\n`;
    waMessage += `*DETAIL PESANAN:*\n`;
    waMessage += `🛍️ *${selectedProduct.name}*\n`;
    waMessage += `• Saiz: ${selectedSize}\n`;
    waMessage += `• Warna: ${selectedColor}\n`;
    waMessage += `• Kuantiti: ${purchaseQty} unit\n`;
    waMessage += `• Harga Seunit: RM ${unitSell.toFixed(2)}\n\n`;
    waMessage += `*JUMLAH KESELURAHAN:* RM ${totalAmount.toFixed(2)}\n\n`;
    waMessage += `Terima kasih Ika! Sila sahkan pesanan ini. 🌸`;

    // 3. Open WhatsApp link to Ika (0146434889 -> 60146434889)
    const waUrl = `https://wa.me/60146434889?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank');

    setOrderSuccessMsg(true);
    setTimeout(() => {
      setSelectedProduct(null);
      setOrderSuccessMsg(false);
    }, 1800);
  };

  // Complete Full Cart Checkout (Sends Cart Items to WhatsApp Ika: 0146434889)
  const handleCheckoutCart = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const cartRefId = `CART-${Math.floor(100000 + Math.random() * 900000)}`;
    const cName = customerName.trim() || 'Pelanggan Storefront';

    let waMessage = `*PESANAN TROLI BAHARU - HN ENTERPRISE 💕*\n\n`;
    waMessage += `*Nama Pelanggan:* ${cName}\n`;
    waMessage += `*No. Rujukan:* ${cartRefId}\n\n`;
    waMessage += `*SENARAI BARANG TROLI (${totalCartCount} item):*\n`;

    cart.forEach((item, idx) => {
      const itemTotal = item.unitPrice * item.quantity;
      const profit = (item.unitPrice - item.costPrice) * item.quantity;

      // Log each transaction item
      onCustomerPurchase({
        id: `tx-${Date.now()}-${idx}`,
        type: 'STOCK_OUT',
        productId: item.productId,
        productName: `${item.productName} [${item.size} / ${item.color}]`,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalAmount: itemTotal,
        profit: profit,
        party: `Pelanggan: ${cName}`,
        reference: cartRefId,
        timestamp: new Date().toISOString()
      });

      waMessage += `\n${idx + 1}. *${item.productName}*\n`;
      waMessage += `   • Saiz: ${item.size} | Warna: ${item.color}\n`;
      waMessage += `   • ${item.quantity} x RM ${item.unitPrice.toFixed(2)} = RM ${itemTotal.toFixed(2)}\n`;
    });

    waMessage += `\n*JUMLAH KESELURAHAN:* RM ${cartTotalAmount.toFixed(2)}\n\n`;
    waMessage += `Terima kasih Ika! Sila sahkan pesanan ini. 🌸`;

    // Open WhatsApp link to Ika (0146434889 -> 60146434889)
    const waUrl = `https://wa.me/60146434889?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank');

    setCart([]);
    setIsCartOpen(false);
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  // Total amount in cart
  const cartTotalAmount = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const whatsappLink = "https://wa.me/60146434889?text=Hai%20Ika%2C%20saya%20ada%20pertanyaan%20mengenai%20produk%20HN%20Enterprise";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

      {/* Customer Header Bar (Centred on mobile screens + Cart Button) */}
      <div className="customer-header-bar">
        <div className="customer-brand-info">
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ff4d6d' }}>
            HN ENTERPRISE 💕
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: '600' }}>
            Boutique & Fashion Storefront 🛍️
          </p>
        </div>

        {/* Action Buttons: Shopping Cart + Admin Login */}
        <div className="customer-admin-btn-wrap" style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {/* Shopping Cart Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ 
              borderRadius: 'var(--radius-full)', 
              position: 'relative',
              background: 'linear-gradient(135deg, #ff85a1 0%, #ff4d6d 100%)',
              padding: '0.55rem 1.1rem'
            }}
          >
            <ShoppingCart size={17} />
            <span>Troli ({totalCartCount})</span>
          </button>

          {isAdminLoggedIn && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={onGoToAdminPanel}
              style={{ borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #7209b7 0%, #3a0ca3 100%)' }}
            >
              <ShieldCheck size={14} />
              <span>Admin Panel ⚙️</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs & Search Filter */}
      <div className="glass-card" style={{ padding: '0.8rem 1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Horizontal Scrollable Category Pills */}
          <div style={{ 
            display: 'flex', 
            gap: '0.4rem', 
            overflowX: 'auto', 
            WebkitOverflowScrolling: 'touch',
            paddingBottom: '0.2rem' 
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  border: 'none',
                  background: selectedCategory === cat ? '#ff4d6d' : '#f8ecee',
                  color: selectedCategory === cat ? '#ffffff' : '#5c444e',
                  padding: '0.4rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                {cat === 'ALL' ? '🌸 SEMUA KOLEKSI' : cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Cari baju idaman anda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                paddingLeft: '2.3rem', 
                paddingTop: '0.5rem', 
                paddingBottom: '0.5rem', 
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem' 
              }}
            />
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>
      </div>

        {/* Product Lookbook Grid (Grouped by Main Product Collection) */}
      <div className="mobile-storefront-grid">
        {groupedCollections.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '2px dashed #ffccd5' }}>
            <Package size={38} color="#ff4d6d" style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ff4d6d' }}>Tiada koleksi dijumpai 🌸</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Sila cuba carian lain.</p>
          </div>
        ) : (
          groupedCollections.map((group) => {
            const firstVariant = group.variants[0];
            const isSoldOut = group.variants.every(v => v.stock === 0);
            const imageSrc = group.coverImage || firstVariant.image || '/images/jubah_plain_parasha.jpg';
            const displayPrice = firstVariant.discountPrice && firstVariant.discountPrice > 0 
              ? firstVariant.discountPrice 
              : (firstVariant.sellingPrice || 49);

            return (
              <div 
                key={group.groupId} 
                style={{
                  background: '#ffffff',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  position: 'relative'
                }}
              >
                {/* Photo Frame (Clickable for Fullscreen View) */}
                <div 
                  onClick={() => setFullscreenImage({ src: imageSrc, title: group.mainName, color: `${group.variants.length} Variasi Warna` })}
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    paddingTop: '133%',
                    overflow: 'hidden',
                    background: '#fff0f3',
                    cursor: 'pointer'
                  }}
                  title="Tekan untuk lihat gambar penuh (Full Screen) 🔍"
                >
                  <img 
                    src={imageSrc} 
                    alt={group.mainName}
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

                  {/* Zoom Indicator Icon */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.55)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    <ZoomIn size={15} />
                  </div>

                  {/* Wishlist Heart Icon */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ff4d6d',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <Heart size={16} fill={isSoldOut ? 'none' : '#ff4d6d'} />
                  </div>

                  {/* Overlay Status Badge */}
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px' }}>
                    {isSoldOut ? (
                      <span className="badge badge-sold-out" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}>
                        SOLD OUT 🎀
                      </span>
                    ) : (
                      <span style={{ 
                        background: 'rgba(255, 255, 255, 0.92)', 
                        color: '#ff124f', 
                        fontSize: '0.68rem', 
                        fontWeight: '800', 
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid #ffccd5'
                      }}>
                        ● {group.variants.length} Variasi Warna & Saiz
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.2rem' }}>
                      {(group.category || 'JUBAH').toUpperCase()}
                    </div>

                    <h4 style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: '800', 
                      textTransform: 'uppercase', 
                      lineHeight: '1.25',
                      color: isSoldOut ? '#888' : '#2b1e22',
                      marginBottom: '0.35rem'
                    }}>
                      {group.mainName}
                    </h4>

                    <div style={{ fontSize: '0.75rem', color: '#7209b7', fontWeight: '700', marginBottom: '0.5rem' }}>
                      🎨 {group.variants.map(v => v.color).filter(Boolean).join(', ')}
                    </div>

                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ff124f', fontFamily: 'var(--font-heading)' }}>
                      RM {displayPrice.toFixed(2)}
                    </div>
                  </div>

                  {/* Customer Purchase / Add to Cart Trigger Button */}
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleOpenGroupBuyModal(group)}
                    disabled={isSoldOut}
                    style={{ 
                      width: '100%', 
                      marginTop: '0.75rem', 
                      fontSize: '0.82rem',
                      padding: '0.55rem 0.5rem',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    <ShoppingBag size={14} />
                    <span>{isSoldOut ? 'SOLD OUT' : 'PILIH SAIZ & BELI 🛍️'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Footer Section */}
      <footer style={{ 
        marginTop: '2rem', 
        padding: '2.5rem 1.5rem 1.8rem 1.5rem', 
        background: '#ffffff', 
        border: '2px solid var(--border-color)', 
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.8rem'
      }}>
        {/* WhatsApp Direct Contact Box */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center', 
          gap: '1rem',
          background: 'linear-gradient(135deg, #fff5f7 0%, #fff0f3 100%)',
          padding: '1.8rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid #ffccd5',
          maxWidth: '800px',
          width: '100%',
          margin: '0 auto',
          boxShadow: '0 4px 20px rgba(255, 133, 161, 0.08)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ff4d6d', fontFamily: 'var(--font-heading)', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              HN ENTERPRISE 💕
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.35rem', maxWidth: '550px', lineHeight: '1.5' }}>
              Terima kasih kerana menyokong perniagaan tempatan kami! Jika anda mempunyai sebarang soalan, sila hubungi kami terus. 🌸✨
            </p>
          </div>

          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn"
            style={{ 
              background: '#25D366', 
              color: '#ffffff', 
              boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
              textDecoration: 'none',
              padding: '0.75rem 1.6rem',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <MessageCircle size={22} />
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <div style={{ fontSize: '0.72rem', opacity: 0.9, fontWeight: '700', letterSpacing: '0.04em' }}>HUBUNGI WHATSAPP</div>
              <div style={{ fontSize: '0.98rem', fontWeight: '800' }}>Ika - 0146434889</div>
            </div>
          </a>
        </div>

        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.82rem', 
          color: 'var(--text-muted)', 
          fontWeight: '700',
          fontFamily: 'var(--font-heading)',
          paddingTop: '0.2rem'
        }}>
          <span>HN Enterprise all right reserved 2026 💕</span>
          {!isAdminLoggedIn && (
            <button 
              onClick={onOpenAdminLogin}
              title="Admin Login"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-muted)', 
                opacity: 0.5, 
                cursor: 'pointer', 
                padding: '2px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <Lock size={13} />
            </button>
          )}
        </div>
      </footer>

      <style>{`
        .customer-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-bottom: 0.8rem;
          border-bottom: 2px solid #f0e6e1;
        }
        .mobile-storefront-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 640px) {
          .customer-header-bar {
            flex-direction: column !important;
            text-align: center !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0.6rem !important;
          }
          .customer-brand-info {
            text-align: center !important;
          }
          .customer-admin-btn-wrap {
            display: flex;
            justify-content: center;
            width: 100%;
          }
          .mobile-storefront-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>

      {/* SINGLE PRODUCT DETAIL & SELECTION MODAL */}
      {selectedProduct && (() => {
        const availableSizes = selectedProduct.size 
          ? selectedProduct.size.split(',').map(s => s.trim()).filter(Boolean) 
          : ['FREE SIZE'];

        const availableColors = selectedProduct.color 
          ? selectedProduct.color.split(',').map(c => c.trim()).filter(Boolean) 
          : ['STANDART'];

        const unitSellPrice = (selectedProduct.discountPrice && selectedProduct.discountPrice > 0) 
          ? selectedProduct.discountPrice 
          : (selectedProduct.sellingPrice || 0);

        return (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ShoppingBag size={20} color="#ff4d6d" />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Pilih Saiz, Warna & Beli 🛍️</h2>
                </div>
                <button className="close-btn" onClick={() => setSelectedProduct(null)}><X size={18} /></button>
              </div>

              {orderSuccessMsg ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e8fccf', color: '#2b9348', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem auto' }}>
                    <Check size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2b9348' }}>Pesanan Berjaya! 🌸</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    Terima kasih. Pesanan anda telah dihantar dan sedang menunggu pengesahan admin.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCompleteSingleOrder}>
                  {/* Product Card Overview */}
                  <div style={{ display: 'flex', gap: '0.9rem', background: '#fff5f7', padding: '0.9rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid #ffccd5', alignItems: 'center' }}>
                    <div 
                      onClick={() => setFullscreenImage({ 
                        src: resolveColorImage(selectedProduct, selectedColor), 
                        title: selectedProduct.name, 
                        color: selectedColor 
                      })}
                      style={{ 
                        position: 'relative', 
                        width: '75px', 
                        height: '100px', 
                        flexShrink: 0, 
                        borderRadius: '8px', 
                        overflow: 'hidden', 
                        border: '2px solid #ff85a1', 
                        boxShadow: '0 4px 12px rgba(255,133,161,0.2)',
                        cursor: 'pointer'
                      }}
                      title="Tekan untuk besarkan gambar 🔍"
                    >
                      <img 
                        src={resolveColorImage(selectedProduct, selectedColor)} 
                        alt={selectedProduct.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }} 
                      />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#2b1e22' }}>{selectedProduct.name}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        SKU: {selectedProduct.sku} • Baki Stok: <strong style={{ color: '#2b9348' }}>{selectedProduct.stock} unit</strong>
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ff124f', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
                        RM {unitSellPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* 1. SELECTION: WARNA / VARIASI STOK & GAMBAR */}
                  {selectedGroup && selectedGroup.variants && selectedGroup.variants.length > 1 && (
                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                      <label style={{ fontWeight: '800', fontSize: '0.88rem', color: '#ff124f' }}>
                        1. Pilih Warna / Gambar Baju *
                      </label>
                      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                        {selectedGroup.variants.map((variantItem) => {
                          const isSelected = selectedProduct && selectedProduct.id === variantItem.id;
                          const colorLabel = variantItem.color || variantItem.name;

                          return (
                            <button
                              key={variantItem.id}
                              type="button"
                              onClick={() => handleSelectVariantInGroup(variantItem)}
                              style={{
                                border: isSelected ? '2px solid #ff4d6d' : '1.5px solid #ffccd5',
                                background: isSelected ? '#ff4d6d' : '#ffffff',
                                color: isSelected ? '#ffffff' : '#2b1e22',
                                padding: '0.45rem 0.9rem',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: '700',
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.15s ease',
                                boxShadow: isSelected ? '0 4px 12px rgba(255,77,109,0.3)' : 'none'
                              }}
                            >
                              {isSelected && <Check size={14} />}
                              <span>{colorLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. SELECTION: SAIZ PAKAIAN (Tally with stock entry) */}
                  <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                    <label style={{ fontWeight: '800', fontSize: '0.88rem' }}>2. Pilih Saiz Pakaian *</label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                      {availableSizes.map(sz => {
                        const isSelected = selectedSize === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setSelectedSize(sz)}
                            style={{
                              border: isSelected ? '2px solid #ff4d6d' : '1.5px solid var(--border-color)',
                              background: isSelected ? '#ff4d6d' : '#ffffff',
                              color: isSelected ? '#ffffff' : 'var(--text-main)',
                              padding: '0.45rem 0.95rem',
                              borderRadius: 'var(--radius-full)',
                              fontWeight: '700',
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Nama Pelanggan (Optional)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Contoh: Aina / Walk-in"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Kuantiti (Unit) *</label>
                    <input 
                      type="number" 
                      min="1"
                      max={selectedProduct.stock}
                      className="form-control"
                      value={purchaseQty}
                      onChange={(e) => setPurchaseQty(parseInt(e.target.value, 10) || 1)}
                      required
                    />
                  </div>

                  <div style={{ background: '#ffe5ec', border: '1px solid #ffccd5', padding: '0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ff4d6d' }}>JUMLAH BAYARAN:</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ff124f', fontFamily: 'var(--font-heading)' }}>
                      RM {(unitSellPrice * purchaseQty).toFixed(2)}
                    </span>
                  </div>

                  {/* Dual Action Buttons: Add to Cart OR Buy Now */}
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleAddToCart}
                      style={{ flex: 1, borderColor: '#ff85a1', color: '#ff4d6d' }}
                    >
                      <ShoppingCart size={16} /> Add to Cart 🛒
                    </button>

                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      Hantar Pesanan 🛍️
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        );
      })()}

      {/* SHOPPING CART DRAWER / MODAL */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShoppingCart size={22} color="#ff4d6d" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Troli Pembelian Pelanggan 🛒</h2>
              </div>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}><X size={20} /></button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <ShoppingCart size={42} color="#ffccd5" style={{ marginBottom: '0.6rem' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-muted)' }}>Troli anda masih kosong 🌸</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                  Pilih produk idaman anda dan tekan <strong>Add to Cart</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutCart}>
                {/* Cart Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', marginBottom: '1.2rem', paddingRight: '0.2rem' }}>
                  {cart.map(item => (
                    <div 
                      key={item.cartId}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        background: '#fff5f7', 
                        padding: '0.75rem 0.9rem', 
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid #ffccd5',
                        gap: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={item.image || '/images/oversized_graphic_tee.jpg'} alt="" style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                        <div>
                          <h5 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2b1e22' }}>{item.productName}</h5>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Saiz: <strong style={{ color: '#ff4d6d' }}>{item.size}</strong> • Warna: <strong style={{ color: '#7209b7' }}>{item.color}</strong>
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ff124f', marginTop: '2px' }}>
                            {item.quantity} x RM {item.unitPrice.toFixed(2)} = RM {(item.quantity * item.unitPrice).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <button 
                        type="button"
                        onClick={() => handleRemoveFromCart(item.cartId)}
                        style={{ background: 'none', border: 'none', color: '#ff4d6d', cursor: 'pointer', padding: '0.4rem' }}
                        title="Buang dari cart"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label>Nama Pelanggan (Optional)</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Contoh: Aina / Walk-in"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                {/* Cart Total Card */}
                <div style={{ background: '#ffe5ec', border: '1px solid #ffccd5', padding: '0.9rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ff4d6d' }}>JUMLAH KESELURAHAN ({totalCartCount} item):</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ff124f', fontFamily: 'var(--font-heading)' }}>
                    RM {cartTotalAmount.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsCartOpen(false)}>Kembali</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Hantar Pesanan Cart ({totalCartCount}) 🛍️
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {fullscreenImage && (
        <div 
          className="modal-overlay" 
          onClick={() => setFullscreenImage(null)}
          style={{ 
            zIndex: 99999, 
            background: 'rgba(0, 0, 0, 0.92)', 
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          {/* Top Control Bar with Back Button */}
          <div style={{ 
            position: 'absolute', 
            top: '1.2rem', 
            left: '1.2rem', 
            right: '1.2rem', 
            display: 'flex', 
            justify: 'space-between', 
            alignItems: 'center',
            zIndex: 100000
          }}>
            <button 
              onClick={() => setFullscreenImage(null)}
              className="btn"
              style={{ 
                background: 'rgba(255, 255, 255, 0.22)', 
                color: '#ffffff', 
                borderRadius: 'var(--radius-full)', 
                padding: '0.55rem 1.2rem',
                fontSize: '0.88rem',
                fontWeight: '700',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255, 255, 255, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
            >
              <ArrowLeft size={18} />
              <span>Kembali ⬅️</span>
            </button>

            <button 
              onClick={() => setFullscreenImage(null)}
              style={{ 
                background: 'rgba(255, 255, 255, 0.22)', 
                border: '1.5px solid rgba(255, 255, 255, 0.4)', 
                color: '#ffffff', 
                width: '42px', 
                height: '42px', 
                borderRadius: '50%', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Big Image Frame */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '92vw', 
              maxHeight: '82vh', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 15px 50px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#0d0d0d',
              padding: '0.5rem',
              border: '1px solid rgba(255,255,255,0.15)'
            }}
          >
            <img 
              src={fullscreenImage.src} 
              alt={fullscreenImage.title || 'Produk'} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '75vh', 
                objectFit: 'contain', 
                borderRadius: '12px' 
              }} 
            />
            {fullscreenImage.title && (
              <div style={{ marginTop: '0.75rem', textAlign: 'center', color: '#ffffff', padding: '0 0.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ff85a1' }}>
                  {fullscreenImage.title}
                </h4>
                {fullscreenImage.color && (
                  <span style={{ fontSize: '0.82rem', color: '#e0d6da', fontWeight: '600' }}>
                    Warna: <strong style={{ color: '#ffffff' }}>{fullscreenImage.color}</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
