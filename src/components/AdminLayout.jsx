import React, { useState } from 'react';
import Navbar from './Navbar';
import OverviewDashboard from './OverviewDashboard';
import StockSection from './StockSection';
import FinanceSection from './FinanceSection';
import { LogOut, Store, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ 
  products, 
  transactions, 
  onOpenProductModal, 
  onDeleteProduct, 
  onOpenMovementModal, 
  onDeleteTransaction, 
  onConfirmOrder,
  onRejectOrder,
  onResetData,
  onLogoutAdmin,
  onGoToStorefront 
}) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
      {/* Top Admin Status Bar */}
      <header style={{ 
        background: '#ffffff', 
        borderBottom: '2px solid var(--border-color)', 
        padding: '0.8rem 2.5rem', 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: '50%', background: '#ffe5ec', color: '#ff4d6d' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.92rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ff4d6d' }}>
              PANEL PENGURUSAN ADMIN 🔐
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>
              Akses Penuh Pengurusan Stok & Kewangan Kedai
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onGoToStorefront}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <Store size={15} /> Lihat Menu Customer 🛍️
          </button>

          <button 
            className="btn btn-danger btn-sm"
            onClick={onLogoutAdmin}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <LogOut size={15} /> Log Keluar Admin 🚪
          </button>
        </div>
      </header>

      {/* Admin Panel Body with Sidebar */}
      <div className="app-container">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onResetData={onResetData} 
        />

        <main className="main-content">
          {/* 1. OVERVIEW: Orders pending confirmation & read-only summary */}
          {activeTab === 'overview' && (
            <OverviewDashboard 
              products={products}
              transactions={transactions}
              onConfirmOrder={onConfirmOrder}
              onRejectOrder={onRejectOrder}
              setActiveTab={setActiveTab}
            />
          )}

          {/* 2. STOK MANAGEMENT: Edit, tambah stok, buang stok, edit stok, upload gambar */}
          {activeTab === 'stock' && (
            <StockSection 
              products={products}
              transactions={transactions}
              onOpenProductModal={onOpenProductModal}
              onDeleteProduct={onDeleteProduct}
              onOpenMovementModal={onOpenMovementModal}
            />
          )}

          {/* 3. KEWANGAN: Rekod jualan (auto & manual), transaksi belian, & aliran duit lain */}
          {activeTab === 'finance' && (
            <FinanceSection 
              products={products}
              transactions={transactions}
              onOpenMovementModal={onOpenMovementModal}
              onDeleteTransaction={onDeleteTransaction}
            />
          )}
        </main>
      </div>
    </div>
  );
}
