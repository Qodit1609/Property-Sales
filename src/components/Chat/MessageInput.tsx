import React, { memo, useState, useRef, useEffect } from 'react';
import type { Message } from '../../hooks/useChat';

interface MessageInputProps {
  onSendMessage: (content: Message['content']) => void;
  onSendProperty?: (property: any) => void;
  onSendLocation?: (coordinates: [number, number], address: string) => void;
  onSendImage?: (image: { url: string; cloudinaryPublicId: string; caption?: string }) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

const MessageInput = memo(
  ({
    onSendMessage,
    onSendProperty,
    onSendLocation,
    onSendImage,
    onTyping,
    disabled = false,
  }: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

      onSendMessage({
        type: 'text',
        text: message,
      });

      setMessage('');
      setIsTyping(false);
      onTyping(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Create FormData and upload to your backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tag', 'chat');

      try {
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/upload`, {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          onSendImage?.({
            url: data.data.url,
            cloudinaryPublicId: data.data.mediaAsset.cloudinaryPublicId,
            caption: '',
          });
        }
      } catch (error) {
        console.error('Image upload failed:', error);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
                        fileInputRef.current?.click();
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      📷 Image
                    </button>

                    {onSendProperty && (
                      <button
                        onClick={() => {
                          // Trigger property selection modal
                          onSendProperty(null);
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm"
                      >
                        🏠 Property
                      </button>
                    )}

                    {onSendLocation && (
                      <button
                        onClick={() => {
                          // Trigger location picker
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition((position) => {
                              onSendLocation(
                                [position.coords.longitude, position.coords.latitude],
                                `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`
                              );
                            });
                          }
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm"
                      >
                        📍 Location
                      </button>
                    )}
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

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
