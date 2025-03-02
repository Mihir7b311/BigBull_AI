// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { Home, BookOpen, History, PieChart, Settings, User, LogOut, Plus } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">MARP</span> Trades
        </div>
      </div>
      
      <div className="new-chat-btn">
        <Plus size={16} />
        <span>New chat</span>
      </div>
      
      <div className="sidebar-section">
        <div className="section-title">Recent</div>
        <div className="sidebar-items">
          <div className="sidebar-item active">
            <div className="item-icon">
              <History size={16} />
            </div>
            <div className="item-text">Trade ETH for USDC</div>
          </div>
          <div className="sidebar-item">
            <div className="item-icon">
              <History size={16} />
            </div>
            <div className="item-text">Market analysis for SOL</div>
          </div>
          <div className="sidebar-item">
            <div className="item-icon">
              <History size={16} />
            </div>
            <div className="item-text">Portfolio optimization</div>
          </div>
        </div>
      </div>
      
      <div className="sidebar-section">
        <div className="section-title">Tools</div>
        <div className="sidebar-items">
          <div className="sidebar-item">
            <div className="item-icon">
              <PieChart size={16} />
            </div>
            <div className="item-text">Portfolio View</div>
          </div>
          <div className="sidebar-item">
            <div className="item-icon">
              <BookOpen size={16} />
            </div>
            <div className="item-text">Trading Guide</div>
          </div>
          <div className="sidebar-item">
            <div className="item-icon">
              <Settings size={16} />
            </div>
            <div className="item-text">Settings</div>
          </div>
        </div>
      </div>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <div className="user-info">
            <div className="user-name">User</div>
            <div className="user-email">Not Connected</div>
          </div>
        </div>
        <button className="logout-btn">
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;