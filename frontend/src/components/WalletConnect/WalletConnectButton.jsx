// src/components/WalletConnect/WalletConnectButton.jsx
import React, { useState, useEffect } from 'react';
import { Wallet, ChevronDown, AlertTriangle, LogOut } from 'lucide-react';
import { useWalletConnect } from '../../hooks/useWalletConnect';
import WalletConnectModal from './WalletConnectModal';
import './WalletConnectButton.css';

const shortenAddress = (address, chars = 4) => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

const WalletConnectButton = ({ onConnectSuccess, projectId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    connect,
    disconnect,
    connectExisting,
    removeExistingPairing,
    isConnected,
    isLoading,
    address,
    error,
    walletConnectUri,
    uriDeepLink,
    pairings
  } = useWalletConnect({
    projectId: projectId,
    onLoginSuccess: (data) => {
      if (onConnectSuccess) {
        onConnectSuccess(data);
      }
      setIsModalOpen(false);
    }
  });
  
  const handleOpenModal = () => {
    if (!isConnected) {
      setIsModalOpen(true);
      connect();
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleDisconnect = () => {
    disconnect();
  };
  
  // Account menu dropdown functionality
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef(null);
  
  const toggleMenu = () => {
    if (isConnected) {
      setIsMenuOpen(!isMenuOpen);
    }
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <>
      <div className="wallet-connect-wrapper" ref={menuRef}>
        {isConnected ? (
          <button 
            className="wallet-address-button"
            onClick={toggleMenu}
          >
            <div className="wallet-icon">
              <Wallet size={18} />
            </div>
            <span>{shortenAddress(address)}</span>
            <ChevronDown size={16} className={isMenuOpen ? 'chevron-up' : ''} />
          </button>
        ) : (
          <button 
            className="wallet-connect-btn"
            onClick={handleOpenModal}
          >
            <Wallet size={18} />
            <span>Connect Wallet</span>
            <ChevronDown size={16} />
          </button>
        )}
        
        {isMenuOpen && (
          <div className="wallet-menu">
            <div className="wallet-menu-header">
              <span className="wallet-menu-title">Connected Wallet</span>
              <span className="wallet-menu-address">{shortenAddress(address, 8)}</span>
            </div>
            <div className="wallet-menu-actions">
              <button 
                className="wallet-menu-button clipboard" 
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  // Optional: Show a toast notification
                }}
              >
                Copy Address
              </button>
              <button 
                className="wallet-menu-button logout" 
                onClick={handleDisconnect}
              >
                <LogOut size={14} />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        uri={walletConnectUri}
        error={error}
        isLoading={isLoading}
        pairings={pairings}
        deepLink={uriDeepLink}
        onConnectExisting={connectExisting}
        onRemovePairing={removeExistingPairing}
      />
    </>
  );
};

export default WalletConnectButton;