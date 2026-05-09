import React from 'react';
import Icon from './Icon';

const TopNav = ({ onMenuToggle, ongName = 'Kindly ONG' }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        background: 'rgba(13,31,45,.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onMenuToggle}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#FFFFFF',
            padding: 8,
          }}
        >
          <Icon name="menu" size={24} />
        </button>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#00C896' }}>
            Kindly
          </div>
          <div style={{ fontSize: 11, color: '#4A6275', fontWeight: 500 }}>
            Plataforma de voluntariado
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>
            {ongName}
          </div>
          <div style={{ fontSize: 11, color: '#4A6275' }}>
            Administrador
          </div>
        </div>
        <button
          style={{
            background: '#FF5F5F',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Icon name="logout" size={16} color="#FFFFFF" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default TopNav;
