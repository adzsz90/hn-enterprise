export const INITIAL_PRODUCTS = [
  {
    id: "prod-jubah-parasha-001",
    name: "Jubah Parasha Exclusive",
    category: "Jubah",
    sku: "HNE-JUB-001",
    size: "S, M, L, XL, XXL, FREE SIZE",
    color: "HITAM, MERAH, COKLAT, EMERALD GREEN, NAVY BLUE",
    costPrice: 35.00,
    sellingPrice: 89.00,
    discountPrice: 69.00,
    stock: 25,
    minStock: 5,
    description: "Jubah Parasha High Quality Premium Fabric, Cutting A-Cut Selesa & Anggun.",
    image: "/images/oversized_graphic_tee.jpg",
    createdAt: "2026-07-20T10:00:00.000Z"
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx-init-001",
    type: "STOCK_IN",
    productId: "prod-jubah-parasha-001",
    productName: "Jubah Parasha Exclusive [FREE SIZE / HITAM]",
    quantity: 25,
    unitPrice: 35.00,
    totalAmount: 875.00,
    profit: 0,
    party: "Kemasukan Stok Awal Boutique",
    reference: "INIT-RESTOCK-001",
    timestamp: "2026-07-20T10:00:00.000Z"
  }
];
