import React from 'react';
import { X } from 'lucide-react';

const AdminModal = ({ title, isOpen, onClose, onConfirm, children, confirmText = 'Xác nhận' }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '0',
        borderRadius: '16px',
        minWidth: '480px',
        maxWidth: '600px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#0f172a' }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer',
            padding: '4px', borderRadius: '6px', display: 'flex', transition: '0.15s'
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '10px',
          padding: '16px 24px', borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc', borderRadius: '0 0 16px 16px'
        }}>
          <button onClick={onClose} style={{
            padding: '9px 20px', border: '1px solid #e2e8f0', borderRadius: '8px',
            background: '#ffffff', color: '#374151', cursor: 'pointer', fontSize: '14px',
            fontWeight: 500, fontFamily: 'Inter, sans-serif', transition: '0.15s'
          }}>
            Hủy
          </button>
          <button onClick={onConfirm} className="admin-btn-primary" style={{ fontSize: '14px' }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
