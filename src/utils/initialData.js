export const INITIAL_PRODUCTS = [
  {
    id: "prod-jubah-parasha-001",
    name: "Jubah Plain Parasha",
    category: "Jubah",
    sku: "HNE-JUB-001",
    size: "S, M, L, XL, XXL, FREE SIZE",
    color: "EMERALD GREEN, MAROON, DUSTY PURPLE",
    colorImages: {
      "EMERALD GREEN": "/images/jubah_plain_parasha_green.png",
      "MAROON": "/images/jubah_plain_parasha_maroon.png",
      "DUSTY PURPLE": "/images/jubah_plain_parasha.jpg"
    },
    costPrice: 25.00,
    sellingPrice: 69.00,
    discountPrice: 49.00,
    stock: 30,
    minStock: 5,
    description: "Jubah Plain Parasha High Quality Premium Fabric, Cutting A-Cut Selesa, Anggun & Material Ironless.",
    image: "/images/jubah_plain_parasha.jpg",
    createdAt: "2026-07-20T10:00:00.000Z"
  },
  {
    id: "prod-jubah-parasha-green",
    name: "Jubah Plain Parasha - Emerald Green",
    category: "Jubah",
    sku: "HNE-JUB-GRN",
    size: "S, M, L, XL, XXL, FREE SIZE",
    color: "EMERALD GREEN",
    colorImages: {
      "EMERALD GREEN": "/images/jubah_plain_parasha_green.png"
    },
    costPrice: 25.00,
    sellingPrice: 69.00,
    discountPrice: 49.00,
    stock: 15,
    minStock: 3,
    description: "Jubah Plain Parasha Warna Emerald Green. Fabric Premium High Quality, Cutting A-Cut Selesa, Anggun & Ironless.",
    image: "/images/jubah_plain_parasha_green.png",
    createdAt: "2026-07-21T10:00:00.000Z"
  },
  {
    id: "prod-jubah-parasha-maroon",
    name: "Jubah Plain Parasha - Maroon",
    category: "Jubah",
    sku: "HNE-JUB-MRN",
    size: "S, M, L, XL, XXL, FREE SIZE",
    color: "MAROON",
    colorImages: {
      "MAROON": "/images/jubah_plain_parasha_maroon.png"
    },
    costPrice: 25.00,
    sellingPrice: 69.00,
    discountPrice: 49.00,
    stock: 15,
    minStock: 3,
    description: "Jubah Plain Parasha Warna Maroon. Fabric Premium High Quality, Cutting A-Cut Selesa, Anggun & Ironless.",
    image: "/images/jubah_plain_parasha_maroon.png",
    createdAt: "2026-07-21T10:05:00.000Z"
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx-init-001",
    type: "STOCK_IN",
    productId: "prod-jubah-parasha-001",
    productName: "Jubah Plain Parasha [FREE SIZE / MAROON]",
    quantity: 30,
    unitPrice: 25.00,
    totalAmount: 750.00,
    profit: 0,
    party: "Kemasukan Stok Awal Boutique",
    reference: "INIT-RESTOCK-001",
    timestamp: "2026-07-20T10:00:00.000Z"
  }
];
