import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: { bg: '#00C896', icon: '✓' },
    error: { bg: '#FF5F5F', icon: '✕' },
    info: { bg: '#7B61FF', icon: 'ℹ' },
    warning: { bg: '#FFB547', icon: '!' },
  };

  const { bg, icon } = colors[type] || colors.success;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        background: bg,
        color: '#FFFFFF',
        padding: '16px 24px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: 600,
        boxShadow: '0 8px 32px rgba(0,0,0,.2)',
        animation: 'slideIn 0.3s ease',
        zIndex: 9999,
      }}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      {message}
    </div>
  );

  export default Toast;
};
