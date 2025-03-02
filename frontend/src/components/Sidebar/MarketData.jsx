// src/components/Sidebar/MarketData.jsx
import React from 'react';
import { BarChart2, ArrowUp, ArrowDown } from 'lucide-react';

const MarketData = () => {
  // Hardcoded market data
  const marketData = [
    { name: 'BTC', price: 58432.15, change: 2.34, color: 'positive' },
    { name: 'ETH', price: 2103.48, change: -0.78, color: 'negative' },
    { name: 'SOL', price: 125.67, change: 5.12, color: 'positive' },
    { name: 'AVAX', price: 29.84, change: 1.23, color: 'positive' },
    { name: 'LINK', price: 17.53, change: -1.05, color: 'negative' },
    { name: 'UNI', price: 8.91, change: 0.45, color: 'positive' }
  ];

  return (
    <div className="sidebar-section market-section">
      <div className="section-title">
        <BarChart2 size={16} />
        <span>Market Data</span>
      </div>
      <div className="market-data-list">
        {marketData.map((token, index) => (
          <div className="market-item" key={index}>
            <div className="token-name">{token.name}</div>
            <div className="token-price">${token.price.toLocaleString()}</div>
            <div className={`token-change ${token.color}`}>
              {token.change > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {Math.abs(token.change)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketData;