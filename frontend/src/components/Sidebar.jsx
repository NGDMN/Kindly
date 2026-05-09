import React from 'react';
import Icon from './Icon';

const Sidebar = ({ activeTab, onTabChange, mobileOpen, onClose }) => {
  const NAV_ITEMS = [
    { id: 'dashboard', icon: 'bar-chart', label: 'Dashboard' },
    { id: 'opportunities', icon: 'calendar', label: 'Oportunidades' },
    { id: 'create', icon: 'plus', label: 'Nova Oportunidade' },
    { id: 'enrollees', icon: 'users', label: 'Inscritos' },
    { id: 'profile', icon: 'settings', label: 'Perfil' },
  ];

  const handleClick = (id) => {
    onTabChange(id);
    onClose?.();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 60,
        left: 0,
        bottom: 0,
        width: 220,
        background: 'rgba(13,31,45,.95)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        zIndex: 90,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-220px)',
        transition: 'transform .3s ease',
      }}
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            background: activeTab === item.id ? 'rgba(0,200,150,.15)' : 'rgba(0,200,150,.06)',
            color: activeTab === item.id ? '#00C896' : '#4A6275',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            transition: 'all .2s',
            fontFamily: "'Syne', sans-serif",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== item.id) {
              e.target.style.background = 'rgba(0,200,150,.12)';
              e.target.style.color = '#FFFFFF';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== item.id) {
              e.target.style.background = 'rgba(0,200,150,.06)';
              e.target.style.color = '#4A6275';
            }
          }}
        >
          <Icon name={item.icon} size={18} color={activeTab === item.id ? '#00C896' : '#4A6275'} />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
