import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() !== '') {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="chatbot-input">
      <input 
        type="text" 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend} className="send-button">
        <IoSend className="send-icon" />
      </button>
    </div>
  );
};

export default ChatInput;