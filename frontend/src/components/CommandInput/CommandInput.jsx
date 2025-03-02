// src/components/CommandInput/CommandInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import './CommandInput.css';

const CommandInput = ({ onSubmit }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const minHeight = 24;
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
      <form className="command-form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="command-textarea"
          rows={1}
        />
        <button 
          type="submit" 
          className={`send-button ${!message.trim() ? 'disabled' : ''}`}
          disabled={!message.trim()}
        >
          <Send size={16} />
        </button>
      </form>
      <div className="command-footer">
        <p className="footer-text">
          Marp Trades uses advanced AI to help you with trading decisions. Your data is secure.
        </p>
      </div>
    </div>
  );
};

export default CommandInput;