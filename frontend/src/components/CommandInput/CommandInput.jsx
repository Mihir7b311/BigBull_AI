// src/components/CommandInput/CommandInput.jsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './CommandInput.css';

const CommandInput = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <div className="command-container">
      <form className="command-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type 'trade' to start trading or ask me anything..."
          className="command-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default CommandInput;