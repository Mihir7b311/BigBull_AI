// src/components/Chat/MessageBubble.jsx
import React from 'react';
import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isAgent = message.sender === 'agent';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    // You could add a notification here
  };
  
  return (
    <div className={`message ${message.sender}`}>
      {isAgent && (
        <div className="agent-avatar">
          <img src="https://via.placeholder.com/40" alt="Agent" />
        </div>
      )}
      
      <div className="message-content">
        <div className="message-bubble">
          <div className="message-text">{message.text}</div>
          
          {isAgent && (
            <div className="message-actions">
              <button className="message-action-btn" onClick={handleCopy}>
                <Copy size={14} />
              </button>
              <button className="message-action-btn">
                <ThumbsUp size={14} />
              </button>
              <button className="message-action-btn">
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>
        
        <div className="message-time">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {!isAgent && (
        <div className="user-avatar">
          <div className="avatar-placeholder">U</div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;