// src/components/CommandInput/CommandInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, PlusCircle } from 'lucide-react';
import './CommandInput.css';

const CommandInput = ({ onSubmit }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const minHeight = 60;
  const maxHeight = 200;

  const adjustHeight = (reset = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (reset) {
      textarea.style.height = `${minHeight}px`;
      return;
    }

    // Reset height to get the right scrollHeight
    textarea.style.height = `${minHeight}px`;
    
    // Calculate new height
    const newHeight = Math.max(
      minHeight,
      Math.min(textarea.scrollHeight, maxHeight)
    );
    
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    // Set initial height
    if (textareaRef.current) {
      textareaRef.current.style.height = `${minHeight}px`;
    }
    
    // Adjust height on window resize
    const handleResize = () => adjustHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
      adjustHeight(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="command-container">
      <div className="command-box">
        <div className="textarea-container">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type 'trade' to start trading or ask me anything..."
            className="command-textarea"
          />
        </div>
        
        <div className="command-actions">
          <div className="left-actions">
            <button className="action-btn attach-btn">
              <Paperclip size={16} />
              <span className="action-label">Attach</span>
            </button>
          </div>
          
          <div className="right-actions">
            <button className="action-btn project-btn">
              <PlusCircle size={16} />
              <span>Project</span>
            </button>
            
            <button 
              className={`send-button ${!message.trim() ? 'disabled' : ''}`}
              onClick={handleSubmit}
              disabled={!message.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="command-suggestions">
        <SuggestionButton icon={<Send size={14} />} label="Swap 0.5 ETH to USDC" />
        <SuggestionButton icon={<Send size={14} />} label="Check gas prices" />
        <SuggestionButton icon={<Send size={14} />} label="Show my portfolio" />
        <SuggestionButton icon={<Send size={14} />} label="Set limit order" />
      </div>
    </div>
  );
};

const SuggestionButton = ({ icon, label }) => {
  return (
    <button className="suggestion-btn">
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default CommandInput;