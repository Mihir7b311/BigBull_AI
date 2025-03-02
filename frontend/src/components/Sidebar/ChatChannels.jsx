// src/components/Sidebar/ChatChannels.jsx
import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatChannels = () => {
  return (
    <div className="sidebar-section chat-channels">
      <div className="section-title">
        <MessageSquare size={16} />
        <span>Chat Channels</span>
      </div>
      <div className="menu-item active">
        <MessageSquare size={18} />
        <span>Main Trading</span>
      </div>
      <div className="menu-item">
        <MessageSquare size={18} />
        <span>Portfolio Analysis</span>
      </div>
      <div className="menu-item">
        <MessageSquare size={18} />
        <span>Yield Farming</span>
      </div>
      <div className="menu-item">
        <MessageSquare size={18} />
        <span>NFT Marketplace</span>
      </div>
    </div>
  );
};

export default ChatChannels;