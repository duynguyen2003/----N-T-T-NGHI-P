import React from 'react';

const AdminModal = ({ title, isOpen, onClose, onConfirm, children, confirmText = 'Xác nhận' }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
      <div className="admin-modal-content" style={{ backgroundColor: 'var(--admin-sidebar-bg)', padding: '24px', borderRadius: '8px', minWidth: '400px', border: '1px solid var(--admin-border-color)'}}>
        <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: 'var(--admin-text-primary)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--admin-text-secondary)', cursor: 'pointer', fontSize: '18px' }}>&times;</button>
        </div>
        <div className="admin-modal-body" style={{ marginBottom: '24px' }}>
          {children}
        </div>
        <div className="admin-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="admin-btn-secondary" style={{ padding: '8px 16px', border: '1px solid var(--admin-border-color)', borderRadius: '6px', background: 'transparent', color: 'var(--admin-text-primary)', cursor: 'pointer', transition: 'var(--admin-transition)' }}>Hủy</button>
          <button onClick={onConfirm} className="admin-btn-primary">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
