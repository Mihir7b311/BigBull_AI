// src/components/Sidebar/LogEntry.jsx
import React from 'react';
import { ArrowUpDown, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

const LogEntry = () => {
  return (
    <div className="sidebar-section log-section">
      <div className="section-title">
        <ArrowUpDown size={16} />
        <span>Log Entry</span>
      </div>
      <div className="log-list">
        <div className="log-item">
          <Clock size={14} />
          <span>ETH-USDC swap executed</span>
        </div>
        <div className="log-item warning">
          <AlertTriangle size={14} />
          <span>Gas price surge detected</span>
        </div>
        <div className="log-item">
          <TrendingUp size={14} />
          <span>New limit order placed</span>
        </div>
        <div className="log-item">
          <Clock size={14} />
          <span>Portfolio rebalancing complete</span>
        </div>
      </div>
    </div>
  );
};

export default LogEntry;