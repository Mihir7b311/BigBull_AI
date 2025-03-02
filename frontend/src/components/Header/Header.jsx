// src/components/Header/Header.jsx
import React from 'react';
import { Wallet, ChevronDown } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-text">MARP</span> Trades
        </div>
      </div>
      
      <div className="nav-links">
        <div className="nav-item active">Home</div>
        <div className="nav-item">Library</div>
        <div className="nav-item">Transactions</div>
      </div>
      
      <div className="header-right">
        <button className="wallet-connect-btn">
          <Wallet size={18} />
          <span>Connect Wallet</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};

export default Header;