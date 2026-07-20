import React, { useState } from 'react';
import { X, Lock, Key, AlertCircle } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Password: Angel6038@
    if (password === 'Angel6038@') {
      onLoginSuccess();
      setPassword('');
      onClose();
    } else {
      setErrorMessage("Kata Laluan tidak sah! Sila cuba lagi.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '360px', borderRadius: 'var(--radius-lg)' }}>
        <div className="modal-header" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '50%', background: '#ffe5ec', color: '#ff4d6d' }}>
              <Lock size={18} />
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ff4d6d' }}>
              ADMIN SAHAJA!
            </h2>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div style={{ 
              background: '#ffe5ec', 
              border: '1px solid #ffb3c1', 
              color: '#ff124f', 
              padding: '0.65rem 0.9rem', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: '600',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={14} color="#ff4d6d" />
              <span>Kata Laluan (Password)</span>
            </label>
            <input 
              type="password" 
              className="form-control"
              placeholder="Masukkan Kata Laluan"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Lock size={15} />
              <span>Log Masuk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
