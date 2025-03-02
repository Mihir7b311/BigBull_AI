// src/components/Sidebar/GasPrices.jsx
import React from 'react';
import { Zap } from 'lucide-react';

const GasPrices = () => {
  // Hardcoded gas prices
  const gasPrices = {
    slow: { gwei: 18, usd: 1.53, time: '~5 min' },
    average: { gwei: 24, usd: 2.05, time: '~2 min' },
    fast: { gwei: 31, usd: 2.65, time: '<1 min' }
  };

  return (
    <div className="sidebar-section gas-section">
      <div className="section-title">
        <Zap size={16} />
        <span>Gas Prices</span>
      </div>
      <div className="gas-options">
        <div className="gas-option">
          <div className="gas-type">Slow</div>
          <div className="gas-details">
            <div className="gas-gwei">{gasPrices.slow.gwei} Gwei</div>
            <div className="gas-time">{gasPrices.slow.time}</div>
          </div>
          <div className="gas-usd">${gasPrices.slow.usd}</div>
        </div>
        <div className="gas-option recommended">
          <div className="gas-type">Average</div>
          <div className="gas-details">
            <div className="gas-gwei">{gasPrices.average.gwei} Gwei</div>
            <div className="gas-time">{gasPrices.average.time}</div>
          </div>
          <div className="gas-usd">${gasPrices.average.usd}</div>
        </div>
        <div className="gas-option">
          <div className="gas-type">Fast</div>
          <div className="gas-details">
            <div className="gas-gwei">{gasPrices.fast.gwei} Gwei</div>
            <div className="gas-time">{gasPrices.fast.time}</div>
          </div>
          <div className="gas-usd">${gasPrices.fast.usd}</div>
        </div>
      </div>
    </div>
  );
};

export default GasPrices;