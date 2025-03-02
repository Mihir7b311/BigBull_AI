// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { X } from 'lucide-react';
import MarketData from './MarketData';
import GasPrices from './GasPrices';
import ChatChannels from './ChatChannels';
import LogEntry from './LogEntry';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <span>DeFi Agent</span>
        <button onClick={onToggle} className="icon-btn">
          <X size={20} />
        </button>
      </div>
      
      <div className="sidebar-content">
        <MarketData />
        <GasPrices />
        <ChatChannels />
        <LogEntry />
      </div>
    </div>
  );
};

export default Sidebar;