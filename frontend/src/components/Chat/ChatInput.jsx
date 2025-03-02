// src/components/Chat/ChatInput.jsx
import React, { useState } from 'react';
import { Send, Paperclip, Mic, PlusCircle } from 'lucide-react';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <div className="chat-input-container">
      <div className="chat-suggestions">
        <button className="suggestion">Swap 0.5 ETH to USDC</button>
        <button className="suggestion">Check gas prices</button>
        <button className="suggestion">Show my portfolio</button>
        <button className="suggestion">Set limit order</button>
      </div>
      
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <button type="button" className="input-icon-btn">
          <PlusCircle size={20} />
        </button>
        
        <button type="button" className="input-icon-btn">
          <Paperclip size={20} />
        </button>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message or trade command..."
          className="chat-input"
          rows={1}
        />
        
        <button type="button" className="input-icon-btn">
          <Mic size={20} />
        </button>
        
        <button 
          type="submit" 
          className="send-btn"
          disabled={!message.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;