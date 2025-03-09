// src/components/Header/Header.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import './Header.css';
import WalletConnectButton from '../WalletConnect/WalletConnectButton';

// Update this with your actual WalletConnect Project ID
const WALLET_CONNECT_PROJECT_ID = "556af8e5d7b3ff7edb82b9bdb01c0f9b";

const Header = () => {
  const handleWalletConnected = (data) => {
    console.log('Wallet connected:', data);
    // Here you would typically:
    // 1. Store the wallet address in your application state
    // 2. Fetch user's account balance or other information
    // 3. Update UI to show connected state
  };

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
        <WalletConnectButton 
          projectId={WALLET_CONNECT_PROJECT_ID}
          onConnectSuccess={handleWalletConnected}
        />
      </div>
    </div>
  );
};

export default Header;