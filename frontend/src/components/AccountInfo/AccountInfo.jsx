// src/components/AccountInfo/AccountInfo.jsx
import React from 'react';
import { Wallet } from 'lucide-react';
import './AccountInfo.css';

const AccountInfo = () => {
  // Sample account data
  const isConnected = false;
  const balances = {
    ETH: 0,
    STRK: 0
  };

  return (
    <div className="account-info">
      <div className="account-header">
        <h2 className="section-title">Account</h2>
      </div>
      
      <div className="wallet-status">
        <div className="wallet-icon">
          <Wallet size={24} />
        </div>
        <div className="wallet-details">
          <div className="wallet-label">Connected Wallet</div>
          <div className="wallet-address">Not Connected</div>
        </div>
      </div>
      
      <div className="balances-container">
        <div className="balance-card">
          <div className="balance-header">ETH Balance</div>
          <div className="balance-amount">0 ETH</div>
        </div>
        
        <div className="balance-card">
          <div className="balance-header">STRK Balance</div>
          <div className="balance-amount">0 STRK</div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;