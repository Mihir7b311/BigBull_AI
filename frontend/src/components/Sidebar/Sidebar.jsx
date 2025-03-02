// src/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Top Tokens');
  
  // Top Cryptocurrencies data
  const cryptoData = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$96,545.00', change: '+0.8%', changeType: 'positive' },
    { symbol: 'ETH', name: 'Ethereum', price: '$2,652.37', change: '+2.0%', changeType: 'positive' },
    { symbol: 'USDT', name: 'Tether', price: '$1.00', change: '+0.0%', changeType: 'neutral' },
    { symbol: 'XRP', name: 'Ripple', price: '$2.43', change: '+1.4%', changeType: 'positive' },
    { symbol: 'SOL', name: 'Solana', price: '$200.66', change: '+3.8%', changeType: 'positive' }
  ];
  
  // Memecoins data
  const memecoinsData = [
    { symbol: 'PEPE', baseSymbol: 'ETH', price: '0.000004', change: '+15.2%', changeType: 'positive' },
    { symbol: 'WIF', baseSymbol: 'SOL', price: '$0.42', change: '-5.8%', changeType: 'negative' },
    { symbol: 'BONK', baseSymbol: 'SOL', price: '0.000012', change: '+8.4%', changeType: 'positive' },
    { symbol: 'MEME', baseSymbol: 'ETH', price: '$0.02', change: '-2.1%', changeType: 'negative' },
    { symbol: 'WOJAK', baseSymbol: 'ETH', price: '7.8900e-7', change: '+25.6%', changeType: 'positive' },
    { symbol: 'SHIB', baseSymbol: 'ETH', price: '0.000009', change: '+4.3%', changeType: 'positive' },
    { symbol: 'FLOKI', baseSymbol: 'BSC', price: '0.000034', change: '+12.7%', changeType: 'positive' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        <div 
          className={`sidebar-tab ${activeTab === 'Top Tokens' ? 'active' : ''}`}
          onClick={() => setActiveTab('Top Tokens')}
        >
          Top Tokens
        </div>
        <div 
          className={`sidebar-tab ${activeTab === 'News & Tweets' ? 'active' : ''}`}
          onClick={() => setActiveTab('News & Tweets')}
        >
          News & Tweets
        </div>
      </div>
      
      <div className="market-section">
        <div className="section-title">
          Top Cryptocurrencies
        </div>
        
        <div className="token-table">
          <div className="token-header">
            <div className="token-col asset">ASSET</div>
            <div className="token-col price">PRICE</div>
            <div className="token-col change">24H</div>
          </div>
          
          {cryptoData.map((token, index) => (
            <div className="token-row" key={index}>
              <div className="token-col asset">
                <div className="token-icon">{token.symbol.charAt(0)}</div>
                <div className="token-symbol">{token.symbol}</div>
              </div>
              <div className="token-col price">{token.price}</div>
              <div className={`token-col change ${token.changeType}`}>
                {token.change.startsWith('+') ? <ArrowUp size={12} /> : 
                  token.change.startsWith('-') ? <ArrowDown size={12} /> : null}
                {token.change}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="market-section">
        <div className="section-title">
          Top Memecoins
        </div>
        
        <div className="token-table">
          <div className="token-header">
            <div className="token-col token">TOKEN</div>
            <div className="token-col price">PRICE</div>
            <div className="token-col change">24H</div>
          </div>
          
          {memecoinsData.map((token, index) => (
            <div className="token-row" key={index}>
              <div className="token-col token">
                <div className="token-name">{token.symbol}</div>
                <div className="token-base">{token.baseSymbol}</div>
              </div>
              <div className="token-col price">{token.price}</div>
              <div className={`token-col change ${token.changeType}`}>
                {token.change.startsWith('+') ? <ArrowUp size={12} /> : 
                  token.change.startsWith('-') ? <ArrowDown size={12} /> : null}
                {token.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;