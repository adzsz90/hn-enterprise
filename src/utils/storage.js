import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS } from './initialData';

const PRODUCTS_KEY = 'hne_stock_products_v1';
const TRANSACTIONS_KEY = 'hne_stock_transactions_v1';

const SAMPLE_PROD_IDS = ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6'];
const SAMPLE_TX_IDS = ['tx-1', 'tx-2', 'tx-3', 'tx-4', 'tx-5'];

export const getProducts = () => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  if (!data) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    const list = JSON.parse(data);
    let cleanList = list.filter(p => !SAMPLE_PROD_IDS.includes(p.id));
    
    // Ensure new items (Green & Maroon Jubah) exist in product list
    INITIAL_PRODUCTS.forEach(initP => {
      if (!cleanList.some(p => p.id === initP.id)) {
        cleanList.push(initP);
      }
    });

    if (cleanList.length === 0) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(cleanList));
    return cleanList;
  } catch (e) {
    console.error("Failed to parse products from LocalStorage", e);
    return INITIAL_PRODUCTS;
  }
};

export const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getTransactions = () => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  if (!data) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  }
  try {
    const list = JSON.parse(data);
    let cleanList = list.filter(t => !SAMPLE_TX_IDS.includes(t.id));

    // Ensure initial transactions exist
    INITIAL_TRANSACTIONS.forEach(initT => {
      if (!cleanList.some(t => t.id === initT.id)) {
        cleanList.push(initT);
      }
    });

    if (cleanList.length === 0) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(cleanList));
    return cleanList;
  } catch (e) {
    console.error("Failed to parse transactions from LocalStorage", e);
    return INITIAL_TRANSACTIONS;
  }
};

export const saveTransactions = (transactions) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const resetToDefaultData = () => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
  return { products: INITIAL_PRODUCTS, transactions: INITIAL_TRANSACTIONS };
};
