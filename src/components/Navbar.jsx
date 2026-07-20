import React from 'react';
import { LayoutDashboard, Package, TrendingUp, RefreshCw, Sparkles, Heart } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onResetData }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'stock', label: 'Pengurusan Stok', icon: Package },
    { id: 'finance', label: 'Kewangan', icon: TrendingUp },
  ];

  return (
    <>
      {/* Desktop Sidebar (visible on desktop) */}
      <aside className="desktop-navbar" style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logoBadge}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={styles.brandTitle}>HN ENTERPRISE 💕</h2>
            <span style={styles.brandSubtitle}>Admin Control Panel</span>
          </div>
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...styles.navBtn,
                  ...(isActive ? styles.navBtnActive : {})
                }}
              >
                <Icon size={19} style={{ color: isActive ? '#ff4d6d' : 'var(--text-muted)' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={styles.footer}>
          <div style={styles.appVersion}>Made with <Heart size={11} color="#ff4d6d" fill="#ff4d6d" style={{ display: 'inline', margin: '0 2px' }} /> v1.0 • Apparel</div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Fixed at bottom on smartphones) */}
      <div className="mobile-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        @media (min-width: 901px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          .desktop-navbar {
            display: none !important;
          }
          .mobile-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 65px;
            background: #ffffff;
            border-top: 2px solid var(--border-color);
            display: flex;
            justify-content: space-around;
            align-items: center;
            z-index: 150;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
            padding: 0 0.5rem;
          }
          .mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 0.72rem;
            font-family: var(--font-heading);
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 14px;
            transition: all 0.2s ease;
            cursor: pointer;
            flex: 1;
          }
          .mobile-nav-item.active {
            color: #ff4d6d;
            background: #ffe5ec;
            font-weight: 700;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  sidebar: {
    width: '275px',
    backgroundColor: '#ffffff',
    borderRight: '2px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.75rem 1.1rem',
    flexShrink: 0,
    boxShadow: '4px 0 20px rgba(0,0,0,0.02)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.5rem 0.5rem 1.5rem 0.5rem',
    borderBottom: '2px dashed #f0e6e1',
    marginBottom: '1.5rem',
  },
  logoBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #ff85a1 0%, #ff4d6d 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 16px rgba(255, 133, 161, 0.4)',
  },
  brandTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    color: '#ff4d6d',
    lineHeight: '1.2',
  },
  brandSubtitle: {
    fontSize: '0.74rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    flex: 1,
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.85rem 1.1rem',
    borderRadius: 'var(--radius-full)',
    border: '2px solid transparent',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '0.92rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  navBtnActive: {
    background: '#ffe5ec',
    color: '#ff124f',
    border: '2px solid #ffb3c1',
    boxShadow: '0 4px 12px rgba(255, 77, 109, 0.15)',
  },
  footer: {
    paddingTop: '1rem',
    borderTop: '2px dashed #f0e6e1',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  appVersion: {
    fontSize: '0.72rem',
    color: 'var(--text-dim)',
    textAlign: 'center',
    fontWeight: '600',
  }
};
