import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS } from './initialData';

// Public Realtime Database Cloud Sync Endpoint for HN Enterprise
const CLOUD_DB_URL = 'https://hn-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app';

const PRODUCTS_KEY = 'hne_stock_products_v1';
const TRANSACTIONS_KEY = 'hne_stock_transactions_v1';

// 1. FETCH PRODUCTS FROM CLOUD
export const fetchCloudProducts = async () => {
  try {
    const res = await fetch(`${CLOUD_DB_URL}/products.json`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data) && data.length > 0) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn("Cloud DB fetch failed, using local cache:", err);
  }

  // Fallback to local storage
  const local = localStorage.getItem(PRODUCTS_KEY);
  if (!local) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(local);
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
};

// 2. PUSH PRODUCTS TO CLOUD & LOCALSTORAGE
export const pushCloudProducts = async (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  try {
    await fetch(`${CLOUD_DB_URL}/products.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products)
    });
  } catch (err) {
    console.warn("Cloud DB push products failed:", err);
  }
};

// 3. FETCH TRANSACTIONS FROM CLOUD
export const fetchCloudTransactions = async () => {
  try {
    const res = await fetch(`${CLOUD_DB_URL}/transactions.json`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data) && data.length > 0) {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn("Cloud DB fetch transactions failed, using local cache:", err);
  }

  const local = localStorage.getItem(TRANSACTIONS_KEY);
  if (!local) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  }
  try {
    return JSON.parse(local);
  } catch (e) {
    return INITIAL_TRANSACTIONS;
  }
};

// 4. PUSH TRANSACTIONS TO CLOUD & LOCALSTORAGE
export const pushCloudTransactions = async (transactions) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  try {
    await fetch(`${CLOUD_DB_URL}/transactions.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactions)
    });
  } catch (err) {
    console.warn("Cloud DB push transactions failed:", err);
  }
};
