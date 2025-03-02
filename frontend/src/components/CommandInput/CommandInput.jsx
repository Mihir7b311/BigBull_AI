// src/components/CommandInput/CommandInput.jsx
import React, { useState } from 'react';
import { Terminal, Send, ChevronUp, ChevronDown } from 'lucide-react';
import './CommandInput.css';

const CommandInput = ({ onSubmit }) => {
  const [command, setCommand] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState([
    'set stop-loss ETH 1900',
    'check liquidity USDC/ETH',
    'monitor gas > 30 gwei',
    'withdraw 1000 USDC to 0x742...'
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command);
      setHistory([command, ...history].slice(0, 10));
      setCommand('');
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const selectFromHistory = (cmd) => {
    setCommand(cmd);
  };

  return (
    <div className={`command-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="command-header">
        <div className="command-title">
          <Terminal size={16} />
          <span>Command Terminal</span>
        </div>
        <button className="expand-btn" onClick={toggleExpand}>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>
      
      <form className="command-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter advanced command (e.g., 'set stop-loss ETH 1900')"
          className="command-input"
        />
        <button 
          type="submit" 
          className="command-send-btn"
          disabled={!command.trim()}
        >
          <Send size={18} />
        </button>
      </form>
      
      {isExpanded && (
        <div className="command-history">
          <div className="history-title">Command History</div>
          <div className="history-list">
            {history.map((cmd, index) => (
              <div 
                key={index} 
                className="history-item" 
                onClick={() => selectFromHistory(cmd)}
              >
                <Terminal size={14} />
                <span>{cmd}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandInput;