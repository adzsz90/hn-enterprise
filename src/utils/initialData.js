export const INITIAL_PRODUCTS = [
  {
    id: "prod-jubah-parasha-sz-s",
    name: "Jubah Plain Parasha (Saiz S)",
    category: "Jubah",
    sku: "HNE-JUB-SZ-S",
    size: "S",
    color: "UNGU, BIRU, PINK",
    colorImages: {
      "UNGU": "/images/jubah_plain_parasha_blue_purple_nude.png",
      "BIRU": "/images/jubah_plain_parasha_blue_purple_nude.png",
      "PINK": "/images/jubah_plain_parasha_green_pink_maroon.png"
    },
    costPrice: 25.00,
    sellingPrice: 69.00,
    discountPrice: 49.00,
    stock: 15,
    minStock: 3,
    description: "Jubah Plain Parasha Saiz S. Pilihan warna Ungu, Biru, dan Pink. Material Premium Ironless & Selesa.",
    image: "/images/jubah_plain_parasha_blue_purple_nude.png",
    createdAt: "2026-07-21T11:00:00.000Z"
  },
  {
    id: "prod-jubah-parasha-sz-l",
    name: "Jubah Plain Parasha (Saiz L)",
    category: "Jubah",
    sku: "HNE-JUB-SZ-L",
    size: "L",
    color: "NUDE",
    colorImages: {
      "NUDE": "/images/jubah_plain_parasha_blue_purple_nude.png"
    },
    costPrice: 25.00,
    sellingPrice: 69.00,
    discountPrice: 49.00,
    stock: 10,
    minStock: 3,
    description: "Jubah Plain Parasha Saiz L Warna Nude / Beige. Material Premium Ironless & Anggun.",
    image: "/images/jubah_plain_parasha_blue_purple_nude.png",
    createdAt: "2026-07-21T11:05:00.000Z"
  },
  {
    id: "prod-jubah-parasha-sz-xxl",
    name: "Jubah Plain Parasha (Saiz XXL)",
    category: "Jubah",
    sku: "HNE-JUB-SZ-XXL",
    size: "XXL",
    color: "MAROON, HIJAU EMERALD",
    colorImages: {
      "MAROON": "/images/jubah_plain_parasha_maroon.png",
      "HIJAU EMERALD": "/images/jubah_plain_parasha_green.png"
    },
    costPrice: 25.00,
    sellingPrice: 69.00,
    discountPrice: 49.00,
    stock: 12,
    minStock: 3,
    description: "Jubah Plain Parasha Saiz XXL Pilihan Warna Maroon & Hijau Emerald.",
    image: "/images/jubah_plain_parasha_green_pink_maroon.png",
    createdAt: "2026-07-21T11:10:00.000Z"
  },
  {
    id: "prod-jubah-parasha-green",
    name: "Jubah Plain Parasha - Emerald Green",
    category: "Jubah",
    sku: "HNE-JUB-GRN",
    size: "S, M, L, XL, XXL, FREE SIZE",
    color: "HIJAU EMERALD",
    colorImages: {
      "HIJAU EMERALD": "/images/jubah_plain_parasha_green.png"
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
  },
  {
    id: "prod-jubah-parasha-001",
    name: "Jubah Plain Parasha (Koleksi Penuh)",
    category: "Jubah",
    sku: "HNE-JUB-001",
    size: "S, M, L, XL, XXL, FREE SIZE",
    color: "UNGU, BIRU, PINK, NUDE, MAROON, HIJAU EMERALD",
    colorImages: {
      "UNGU": "/images/jubah_plain_parasha_blue_purple_nude.png",
      "BIRU": "/images/jubah_plain_parasha_blue_purple_nude.png",
      "NUDE": "/images/jubah_plain_parasha_blue_purple_nude.png",
      "PINK": "/images/jubah_plain_parasha_green_pink_maroon.png",
      "MAROON": "/images/jubah_plain_parasha_maroon.png",
      "HIJAU EMERALD": "/images/jubah_plain_parasha_green.png"
    },
    costPrice: 25.00,
    sellingPrice: 69.00,
    discountPrice: 49.00,
    stock: 45,
    minStock: 5,
    description: "Jubah Plain Parasha High Quality Premium Fabric, Cutting A-Cut Selesa, Anggun & Material Ironless.",
    image: "/images/jubah_plain_parasha.jpg",
    createdAt: "2026-07-20T10:00:00.000Z"
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx-init-sz-s",
    type: "STOCK_IN",
    productId: "prod-jubah-parasha-sz-s",
    productName: "Jubah Plain Parasha (Saiz S) [Ungu/Biru/Pink]",
    quantity: 15,
    unitPrice: 25.00,
    totalAmount: 375.00,
    profit: 0,
    party: "Kemasukan Stok Boutique",
    reference: "RESTOCK-SZ-S",
    timestamp: "2026-07-21T11:00:00.000Z"
  },
  {
    id: "tx-init-sz-l",
    type: "STOCK_IN",
    productId: "prod-jubah-parasha-sz-l",
    productName: "Jubah Plain Parasha (Saiz L) [Nude]",
    quantity: 10,
    unitPrice: 25.00,
    totalAmount: 250.00,
    profit: 0,
    party: "Kemasukan Stok Boutique",
    reference: "RESTOCK-SZ-L",
    timestamp: "2026-07-21T11:05:00.000Z"
  },
  {
    id: "tx-init-sz-xxl",
    type: "STOCK_IN",
    productId: "prod-jubah-parasha-sz-xxl",
    productName: "Jubah Plain Parasha (Saiz XXL) [Maroon/Hijau]",
    quantity: 12,
    unitPrice: 25.00,
    totalAmount: 300.00,
    profit: 0,
    party: "Kemasukan Stok Boutique",
    reference: "RESTOCK-SZ-XXL",
    timestamp: "2026-07-21T11:10:00.000Z"
  }
];
