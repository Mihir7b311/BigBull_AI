// src/components/UI/CryptoTransfer.jsx
import React, { useState } from 'react';
import './CryptoTransfer.css';

const CryptoTransfer = ({ onSend, cryptoOptions = ['ETH', 'BTC', 'USDC'] }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0]);

  const handleSend = () => {
    if (amount && address) {
      onSend({
        amount,
        address,
        crypto: selectedCrypto
      });
    }
  };

  return (
    <div className="crypto-transfer">
      <div className="transfer-header">
        <h3>Crypto Transfer</h3>
      </div>
      
      <div className="transfer-form">
        <div className="form-row">
          <div className="form-group">
            <label>Amount</label>
            <div className="input-with-select">
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00" 
                className="amount-input"
              />
              <select 
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                className="crypto-select"
              >
                {cryptoOptions.map(crypto => (
                  <option key={crypto} value={crypto}>{crypto}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Recipient Address</label>
            <input 
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..." 
              className="address-input"
            />
          </div>
        </div>
        
        <button 
          onClick={handleSend} 
          className={`send-button ${(!amount || !address) ? 'disabled' : ''}`}
          disabled={!amount || !address}
        >
          Send {amount ? `${amount} ${selectedCrypto}` : 'Crypto'}
        </button>
      </div>
    </div>
  );
};

export default CryptoTransfer;