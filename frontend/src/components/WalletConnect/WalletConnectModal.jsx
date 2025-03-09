// src/components/WalletConnect/WalletConnectModal.jsx
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { X, Wallet, AlertTriangle, Smartphone, Link2 } from 'lucide-react';
import './WalletConnectModal.css';

const WalletConnectModal = ({
  isOpen,
  onClose,
  uri,
  error,
  isLoading,
  pairings = [],
  deepLink,
  onConnectExisting,
  onRemovePairing
}) => {
  const [activeTab, setActiveTab] = useState('qrcode');
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Redirect to mobile app if on mobile
  const openMobileApp = () => {
    window.location.href = deepLink;
  };
  
  // Check if device is mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (!isOpen) return null;
  
  return (
    <div className="wc-modal-overlay">
      <div className="wc-modal">
        <div className="wc-modal-header">
          <h2 className="wc-modal-title">Connect Wallet</h2>
          <button className="wc-close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="wc-modal-tabs">
          <button 
            className={`wc-tab ${activeTab === 'qrcode' ? 'active' : ''}`}
            onClick={() => setActiveTab('qrcode')}
          >
            <Smartphone size={18} />
            <span>Mobile</span>
          </button>
          {pairings.length > 0 && (
            <button 
              className={`wc-tab ${activeTab === 'recent' ? 'active' : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              <Link2 size={18} />
              <span>Recent</span>
            </button>
          )}
        </div>
        
        <div className="wc-modal-content">
          {error && (
            <div className="wc-error">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {activeTab === 'qrcode' && (
            <div className="wc-qrcode-container">
              {isLoading ? (
                <div className="wc-loading">
                  <div className="wc-spinner"></div>
                  <span>Initializing connection...</span>
                </div>
              ) : uri ? (
                <>
                  <div className="wc-qrcode">
                    <QRCode value={uri} size={280} level="H" />
                  </div>
                  <p className="wc-instruction">Scan with your wallet app</p>
                  
                  {isMobile && (
                    <button className="wc-mobile-button" onClick={openMobileApp}>
                      <Smartphone size={18} />
                      <span>Open Wallet App</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="wc-error">
                  <AlertTriangle size={18} />
                  <span>Failed to generate connection code</span>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'recent' && (
            <div className="wc-recent-container">
              <h3 className="wc-section-title">Recent Connections</h3>
              
              {pairings.length === 0 ? (
                <p className="wc-no-recent">No recent connections found</p>
              ) : (
                <div className="wc-pairings-list">
                  {pairings.map((pairing) => (
                    <div key={pairing.topic} className="wc-pairing-item">
                      <div className="wc-pairing-info">
                        <Wallet size={20} />
                        <div className="wc-pairing-details">
                          <span className="wc-pairing-name">
                            {pairing.peerMetadata?.name || 'Unknown Wallet'}
                          </span>
                          <span className="wc-pairing-date">
                            {new Date(pairing.created).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="wc-pairing-actions">
                        <button 
                          className="wc-connect-button"
                          onClick={() => onConnectExisting(pairing)}
                        >
                          Connect
                        </button>
                        <button 
                          className="wc-remove-button"
                          onClick={() => onRemovePairing(pairing.topic)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;