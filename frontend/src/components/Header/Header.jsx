// src/components/Header/Header.jsx
import React from 'react';
import { Menu, DollarSign, Bell, Settings } from 'lucide-react';
import './Header.css';

const Header = ({ isSidebarOpen, onToggleSidebar }) => {
  return (
    <div className="header">
      {!isSidebarOpen && (
        <button onClick={onToggleSidebar} className="icon-btn sidebar-toggle">
          <Menu size={24} />
        </button>
      )}
      
      <div className="header-tabs">
        <div className="tab active">Trading</div>
        <div className="tab">Layer 1</div>
        <div className="tab">Layer 2</div>
      </div>
      
      <div className="header-actions">
        <button className="icon-btn notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <button className="icon-btn">
          <Settings size={20} />
        </button>
        
        <div className="network-selector">
          <span className="network-dot"></span>
          Ethereum
        </div>
        
        <button className="wallet-btn">
          <DollarSign size={16} />
          <span>0x7A...4E9F</span>
        </button>
      </div>
    </div>
  );
};

export default Header;