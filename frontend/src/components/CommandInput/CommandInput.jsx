// src/components/CommandInput/CommandInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Smile } from 'lucide-react';
import './CommandInput.css';

const CommandInput = ({ onSubmit }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const minHeight = 24;
  const maxHeight = 120;

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
      <form className={`command-form ${isFocused ? 'focused' : ''}`} onSubmit={handleSubmit}>
        <div className="input-tools">
          <button type="button" className="tool-button">
            <Paperclip size={18} />
          </button>
          <button type="button" className="tool-button">
            <Smile size={18} />
          </button>
        </div>
        
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type a message..."
          className="command-textarea"
          rows={1}
          style={{ paddingTop: '10px' }}
        />
        
        <div className="input-actions">
          <button 
            type="button" 
            className="tool-button voice-button"
          >
            <Mic size={18} />
          </button>
          
          <button 
            type="submit" 
            className={`send-button ${!message.trim() ? 'disabled' : ''}`}
            disabled={!message.trim()}
          >
            <Send size={18} />
          </button>
        </div>
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