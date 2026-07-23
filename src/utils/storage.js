const PRODUCTS_KEY = 'hne_stock_products_v1';
const TRANSACTIONS_KEY = 'hne_stock_transactions_v1';

export const getProducts = () => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  let productsList = [];
  if (data) {
    try {
      productsList = JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse products from LocalStorage", e);
    }
  }

  // Explicitly remove Jubah bersulam if it exists in local storage list
  const originalLength = productsList.length;
  productsList = productsList.filter(p => p.id !== 'prod-jubah-bersulam-hitam');
  let storageUpdated = productsList.length !== originalLength;

  // Auto-inject Jubah Putih Bercorak if not present
  const hasJubahPutihBercorak = productsList.some(p => p.id === 'prod-jubah-putih-bercorak');
  if (!hasJubahPutihBercorak) {
    const newProduct = {
      id: 'prod-jubah-putih-bercorak',
      name: 'Jubah Putih Bercorak',
      category: 'Jubah',
      sku: 'HNE-999',
      size: 'FREE SIZE',
      color: 'putih',
      costPrice: 12,
      sellingPrice: 45,
      discountPrice: null,
      stock: 15,
      minStock: 3,
      image: '/images/jubah_putih_bercorak.png',
      description: 'Jubah putih dengan rekaan bercorak eksklusif, kain premium sejuk.',
      createdAt: new Date().toISOString()
    };
    productsList.push(newProduct);
    storageUpdated = true;

    // Also auto-generate its initial restock transaction for Cash Out
    const txData = localStorage.getItem(TRANSACTIONS_KEY);
    let transactionsList = [];
    if (txData) {
      try {
        transactionsList = JSON.parse(txData);
      } catch (e) {}
    }
    const hasJubahTx = transactionsList.some(t => t.productId === 'prod-jubah-putih-bercorak');
    if (!hasJubahTx) {
      const initTx = {
        id: 'tx-jubah-putih-bercorak-init',
        type: 'STOCK_IN',
        productId: 'prod-jubah-putih-bercorak',
        productName: 'Jubah Putih Bercorak (putih)',
        quantity: 15,
        unitPrice: 12,
        totalAmount: 180, // 15 * 12
        profit: 0,
        party: 'Modal Stok Awal / Restock',
        reference: 'RESTOCK-INIT',
        status: 'APPROVED',
        timestamp: new Date().toISOString()
      };
      transactionsList.unshift(initTx);
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactionsList));
    }
  }

  // Also clean up any transactions belonging to the deleted Jubah bersulam
  const txData = localStorage.getItem(TRANSACTIONS_KEY);
  if (txData) {
    try {
      let transactionsList = JSON.parse(txData);
      const initialTxLength = transactionsList.length;
      transactionsList = transactionsList.filter(t => t.productId !== 'prod-jubah-bersulam-hitam' && t.id !== 'tx-jubah-bersulam-init');
      if (transactionsList.length !== initialTxLength) {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactionsList));
      }
    } catch (e) {}
  }

  if (storageUpdated) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productsList));
  }

  return productsList;
};

export const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getTransactions = () => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  let transactionsList = [];
  if (data) {
    try {
      transactionsList = JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse transactions from LocalStorage", e);
      return [];
    }
  }
  // Filter out any leftover jubah bersulam transactions
  return transactionsList.filter(t => t.productId !== 'prod-jubah-bersulam-hitam' && t.id !== 'tx-jubah-bersulam-init');
};

export const saveTransactions = (transactions) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const resetToDefaultData = () => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify([]));
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]));
  return { products: [], transactions: [] };
};
