import React, { memo, useState, useRef } from 'react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

const MessageInput = memo(
  ({
    onSendMessage,
    onTyping,
    disabled = false,
  }: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setMessage(text);

      // Send typing indicator
      if (text.length > 0 && !isTyping) {
        setIsTyping(true);
        onTyping(true);
      }

      // Stop typing after 1 second of inactivity
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (text.length > 0) {
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          onTyping(false);
        }, 1000);
      }
    };

    const handleSendMessage = () => {
      if (!message.trim()) return;

      onSendMessage(message.trim());

      setMessage('');
      setIsTyping(false);
      onTyping(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    return (
      <div className="space-y-2">
        {/* Typing indicator */}
        {isTyping && <p className="text-xs text-gray-500 opacity-50">typing...</p>}

        {/* Message input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <textarea
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              disabled={disabled}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            {/* Action buttons */}
            <div className="absolute bottom-2 right-2 flex gap-1">
              {/* Menu button */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Add media"
                >
                  📎
                </button>

                {/* Dropdown menu */}
                {showMenu && (
                  <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 space-y-2 z-10">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      Text-only chat enabled
                    </button>
                  </div>
                )}
              </div>

              {/* Send button */}
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || disabled}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                title="Send message (Enter)"
              >
                ✈️
              </button>
            </div>
          </div>
        </div>

        {/* Character count */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{message.length} / 5000</span>
          <span>✓ Connected</span>
        </div>
      </div>
    );
  }
);

MessageInput.displayName = 'MessageInput';

export default MessageInput;
