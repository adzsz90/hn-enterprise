import React, { useState, useEffect } from 'react';
import CustomerStorefront from './components/CustomerStorefront';
import AdminLayout from './components/AdminLayout';
import AdminLoginModal from './components/AdminLoginModal';
import ProductModal from './components/ProductModal';
import StockMovementModal from './components/StockMovementModal';

import { 
  fetchCloudProducts, 
  pushCloudProducts, 
  fetchCloudTransactions, 
  pushCloudTransactions 
} from './utils/cloudSync';

import { resetToDefaultData } from './utils/storage';

export default function App() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // App mode: 'customer' (Front page for customers) or 'admin' (Admin Control Panel)
  const [viewMode, setViewMode] = useState('customer');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Admin Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState('STOCK_OUT');
  const [selectedProductForMovement, setSelectedProductForMovement] = useState(null);

  // 1. Initial Load & Realtime Polling Sync (Every 5 seconds)
  useEffect(() => {
    let isMounted = true;

    const loadCloudData = async () => {
      setIsSyncing(true);
      const prods = await fetchCloudProducts();
      const txs = await fetchCloudTransactions();
      if (isMounted) {
        setProducts(prods);
        setTransactions(txs);
        setIsSyncing(false);
      }
    };

    loadCloudData();

    // Auto sync interval every 5 seconds across all devices
    const interval = setInterval(async () => {
      const prods = await fetchCloudProducts();
      const txs = await fetchCloudTransactions();
      if (isMounted) {
        setProducts(prods);
        setTransactions(txs);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Save changes to Cloud & LocalStorage
  const updateProductsState = (newProducts) => {
    setProducts(newProducts);
    pushCloudProducts(newProducts);
  };

  const updateTransactionsState = (newTransactions) => {
    setTransactions(newTransactions);
    pushCloudTransactions(newTransactions);
  };

  // Admin Authentication Handlers (Password: Angel6038@)
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setViewMode('admin');
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setViewMode('customer');
  };

  // Reset data handler
  const handleResetData = () => {
    if (window.confirm("Adakah anda pasti mahu meriset semula data ke data contoh asal? Semua data baharu akan ditetapkan semula.")) {
      const { products: defaultProducts, transactions: defaultTx } = resetToDefaultData();
      updateProductsState(defaultProducts);
      updateTransactionsState(defaultTx);
    }
  };

  // Product Modal Handlers
  const handleOpenProductModal = (product = null) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData) => {
    const existingIndex = products.findIndex(p => p.id === productData.id);
    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...products];
      updatedList[existingIndex] = productData;
    } else {
      updatedList = [productData, ...products];
    }
    updateProductsState(updatedList);
  };

  const handleDeleteProduct = (productId) => {
    const prod = products.find(p => p.id === productId);
    if (window.confirm(`Adakah anda pasti mahu memadam produk "${prod?.name || 'ini'}"?`)) {
      const updatedList = products.filter(p => p.id !== productId);
      updateProductsState(updatedList);
    }
  };

  // Customer Purchase Order Placement (PENDING_APPROVAL)
  const handleCustomerPurchase = (pendingTx) => {
    const newTx = {
      ...pendingTx,
      status: 'PENDING_APPROVAL' // Customer orders require Admin confirmation
    };
    const updatedTx = [newTx, ...transactions];
    updateTransactionsState(updatedTx);
  };

  // Admin Confirm Order (Sahkan Pembelian) -> Deduct stock and record in finance!
  const handleConfirmOrder = (txId) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    const targetProduct = products.find(p => p.id === tx.productId);
    if (targetProduct && tx.quantity > targetProduct.stock) {
      alert(`Stok tidak mencukupi! Baki stok semasa hanya ${targetProduct.stock} unit.`);
      return;
    }

    // 1. Update transaction status to APPROVED
    const updatedTx = transactions.map(t => 
      t.id === txId ? { ...t, status: 'APPROVED' } : t
    );
    updateTransactionsState(updatedTx);

    // 2. Amend stock in products (Deduct stock for confirmed sale)
    if (targetProduct) {
      const newStock = Math.max(0, targetProduct.stock - tx.quantity);
      const updatedProducts = products.map(p => 
        p.id === tx.productId ? { ...p, stock: newStock } : p
      );
      updateProductsState(updatedProducts);
    }
  };

  // Admin Reject/Cancel Order (Batal Pesanan -> Restores stock if previously deducted)
  const handleRejectOrder = (txId) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    if (window.confirm("Adakah anda pasti mahu membatalkan pesanan ini? Stok akan dikembalikan semula sekiranya telah dipotong.")) {
      // 1. Mark status REJECTED
      const updatedTx = transactions.map(t => 
        t.id === txId ? { ...t, status: 'REJECTED' } : t
      );
      updateTransactionsState(updatedTx);

      // 2. If it was previously APPROVED and was a sales order, restore stock!
      if (tx.status === 'APPROVED' && tx.type === 'STOCK_OUT') {
        const targetProduct = products.find(p => p.id === tx.productId);
        if (targetProduct) {
          const updatedProducts = products.map(p => 
            p.id === tx.productId ? { ...p, stock: p.stock + tx.quantity } : p
          );
          updateProductsState(updatedProducts);
        }
      }
    }
  };

  // Stock Movement Modal Handlers (Admin Direct Actions)
  const handleOpenMovementModal = (type = 'STOCK_OUT', product = null) => {
    setMovementType(type);
    setSelectedProductForMovement(product);
    setIsMovementModalOpen(true);
  };

  const handleAddTransaction = (newTx) => {
    // Admin direct entries are APPROVED by default
    const approvedTx = {
      ...newTx,
      status: 'APPROVED'
    };
    const updatedTx = [approvedTx, ...transactions];
    updateTransactionsState(updatedTx);

    // Adjust product stock
    const targetProduct = products.find(p => p.id === newTx.productId);
    if (targetProduct) {
      let newStock = targetProduct.stock;
      if (newTx.type === 'STOCK_OUT') {
        newStock = Math.max(0, targetProduct.stock - newTx.quantity);
      } else if (newTx.type === 'STOCK_IN') {
        newStock = targetProduct.stock + newTx.quantity;
      }

      const updatedProducts = products.map(p => 
        p.id === newTx.productId ? { ...p, stock: newStock } : p
      );
      updateProductsState(updatedProducts);
    }
  };

  // Delete Transaction Handler (Automatically replenishes stock for deleted sales!)
  const handleDeleteTransaction = (txId) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    if (window.confirm("Adakah anda pasti mahu memadam rekod transaksi ini? Stok akan dikembalikan secara automatik.")) {
      // 1. Remove transaction
      const updatedTx = transactions.filter(t => t.id !== txId);
      updateTransactionsState(updatedTx);

      // 2. If it was an approved sales transaction, restore stock (+ quantity)
      if ((tx.status === 'APPROVED' || !tx.status) && tx.type === 'STOCK_OUT') {
        const targetProduct = products.find(p => p.id === tx.productId);
        if (targetProduct) {
          const updatedProducts = products.map(p => 
            p.id === tx.productId ? { ...p, stock: p.stock + tx.quantity } : p
          );
          updateProductsState(updatedProducts);
        }
      } 
      // 3. If it was an approved stock restock transaction, reduce stock (- quantity)
      else if ((tx.status === 'APPROVED' || !tx.status) && tx.type === 'STOCK_IN') {
        const targetProduct = products.find(p => p.id === tx.productId);
        if (targetProduct) {
          const updatedProducts = products.map(p => 
            p.id === tx.productId ? { ...p, stock: Math.max(0, p.stock - tx.quantity) } : p
          );
          updateProductsState(updatedProducts);
        }
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Front Page Customer Storefront View */}
      {viewMode === 'customer' ? (
        <div style={{ padding: '1.5rem' }}>
          <CustomerStorefront 
            products={products}
            onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
            isAdminLoggedIn={isAdminLoggedIn}
            onGoToAdminPanel={() => setViewMode('admin')}
            onCustomerPurchase={handleCustomerPurchase}
          />
        </div>
      ) : (
        /* Admin Control Panel View */
        <AdminLayout 
          products={products}
          transactions={transactions}
          onOpenProductModal={handleOpenProductModal}
          onDeleteProduct={handleDeleteProduct}
          onOpenMovementModal={handleOpenMovementModal}
          onDeleteTransaction={handleDeleteTransaction}
          onConfirmOrder={handleConfirmOrder}
          onRejectOrder={handleRejectOrder}
          onResetData={handleResetData}
          onLogoutAdmin={handleLogoutAdmin}
          onGoToStorefront={() => setViewMode('customer')}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal 
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Modals */}
      <ProductModal 
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />

      <StockMovementModal 
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        movementType={movementType}
        selectedProduct={selectedProductForMovement}
        products={products}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}
