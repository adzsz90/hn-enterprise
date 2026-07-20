export const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "HN Premium Oversized Graphic Tee",
    category: "T-Shirt & Top",
    sku: "HNE-TEE-001-M",
    size: "M",
    color: "Jet Black",
    costPrice: 22.00,
    sellingPrice: 59.00,
    originalPrice: 89.00,
    stock: 18,
    minStock: 5,
    description: "240gsm 100% Heavyweight Cotton Oversized Cut",
    image: "/images/oversized_graphic_tee.jpg",
    createdAt: "2026-07-01T09:00:00.000Z"
  },
  {
    id: "prod-2",
    name: "HN Heavyweight Streetwear Hoodie",
    category: "Hoodie & Sweatshirt",
    sku: "HNE-HD-002-L",
    size: "L",
    color: "Charcoal Grey",
    costPrice: 48.00,
    sellingPrice: 129.00,
    originalPrice: 179.00,
    stock: 12,
    minStock: 5,
    description: "380gsm Fleece Lined Heavy Hoodie with Minimalist Embroidery",
    image: "/images/streetwear_hoodie.jpg",
    createdAt: "2026-07-02T10:30:00.000Z"
  },
  {
    id: "prod-3",
    name: "HN Tactical Cargo Jogger Pants",
    category: "Pants & Bottoms",
    sku: "HNE-CG-003-XL",
    size: "XL",
    color: "Olive Army",
    costPrice: 38.00,
    sellingPrice: 99.00,
    originalPrice: 149.00,
    stock: 0, // SOLD OUT ITEM DEMO!
    minStock: 3,
    description: "Ripstop Fabric Multi-pocket Urban Cargo Pants",
    image: "/images/cargo_jogger_pants.jpg",
    createdAt: "2026-07-03T14:15:00.000Z"
  },
  {
    id: "prod-4",
    name: "HN Signature Minimalist Polo Shirt",
    category: "T-Shirt & Top",
    sku: "HNE-PLO-004-S",
    size: "S",
    color: "Navy Blue",
    costPrice: 28.00,
    sellingPrice: 75.00,
    originalPrice: 109.00,
    stock: 25,
    minStock: 5,
    description: "Pique Cotton Breathable Smart Casual Polo",
    image: "/images/oversized_graphic_tee.jpg",
    createdAt: "2026-07-05T11:00:00.000Z"
  },
  {
    id: "prod-5",
    name: "HN Embroidered 3D Logo Cap",
    category: "Headwear & Accessories",
    sku: "HNE-CAP-005-FS",
    size: "Free Size",
    color: "Vintage Khaki",
    costPrice: 12.00,
    sellingPrice: 39.00,
    originalPrice: 59.00,
    stock: 2, // LOW STOCK DEMO!
    minStock: 5,
    description: "Adjustable 6-Panel Cotton Twill Curved Brim Snapback",
    image: "/images/embroidered_cap.jpg",
    createdAt: "2026-07-08T16:45:00.000Z"
  },
  {
    id: "prod-6",
    name: "HN Vintage Washed Boxy Tee",
    category: "T-Shirt & Top",
    sku: "HNE-TEE-006-L",
    size: "L",
    color: "Washed Acid Black",
    costPrice: 25.00,
    sellingPrice: 69.00,
    originalPrice: 99.00,
    stock: 0, // SOLD OUT ITEM DEMO!
    minStock: 4,
    description: "Acid Wash Drop-Shoulder Boxy Fit Vintage Tee",
    image: "/images/oversized_graphic_tee.jpg",
    createdAt: "2026-07-10T08:20:00.000Z"
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx-1",
    type: "STOCK_IN", // Pembelian
    productId: "prod-1",
    productName: "HN Premium Oversized Graphic Tee",
    quantity: 30,
    unitPrice: 22.00,
    totalAmount: 660.00,
    profit: 0,
    reference: "PO-2026-001",
    party: "Pembekal Tekstil Melaka (Restock)",
    timestamp: "2026-07-01T09:30:00.000Z"
  },
  {
    id: "tx-2",
    type: "STOCK_OUT", // Perolehan / Sales
    productId: "prod-1",
    productName: "HN Premium Oversized Graphic Tee",
    quantity: 5,
    unitPrice: 59.00,
    totalAmount: 295.00,
    profit: 185.00,
    reference: "INV-2026-8801",
    party: "Pelanggan Walk-in / TikTok Shop",
    timestamp: "2026-07-05T14:20:00.000Z"
  },
  {
    id: "tx-3",
    type: "STOCK_IN",
    productId: "prod-2",
    productName: "HN Heavyweight Streetwear Hoodie",
    quantity: 20,
    unitPrice: 48.00,
    totalAmount: 960.00,
    profit: 0,
    reference: "PO-2026-002",
    party: "Kilang Apparel Subang",
    timestamp: "2026-07-02T11:00:00.000Z"
  },
  {
    id: "tx-4",
    type: "STOCK_OUT",
    productId: "prod-2",
    productName: "HN Heavyweight Streetwear Hoodie",
    quantity: 8,
    unitPrice: 129.00,
    totalAmount: 1032.00,
    profit: 648.00,
    reference: "INV-2026-8802",
    party: "Jualan Event Booth KL Fashion",
    timestamp: "2026-07-12T16:00:00.000Z"
  },
  {
    id: "tx-5",
    type: "STOCK_OUT",
    productId: "prod-3",
    productName: "HN Tactical Cargo Jogger Pants",
    quantity: 15,
    unitPrice: 99.00,
    totalAmount: 1485.00,
    profit: 915.00,
    reference: "INV-2026-8803",
    party: "Jualan Web & Shopee",
    timestamp: "2026-07-18T19:40:00.000Z"
  }
];
