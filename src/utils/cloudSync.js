const PRODUCTS_KEY = 'hne_stock_products_v1';
const TRANSACTIONS_KEY = 'hne_stock_transactions_v1';

// Always clear localStorage fallback if empty
export const fetchCloudProducts = async () => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify([]));
  return [];
};

export const pushCloudProducts = async (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const fetchCloudTransactions = async () => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]));
  return [];
};

export const pushCloudTransactions = async (transactions) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};
