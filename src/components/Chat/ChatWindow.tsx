import  { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../../hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { formatDistanceToNow } from 'date-fns';

interface ChatWindowProps {
  conversationId: string;
  participants?: Array<{
    _id: string;
    name: string;
    avatar: string;
    email: string;
  }>;
  onClose?: () => void;
  onBack?: () => void;
  property?: {
    _id: string;
    title: string;
    price: number;
    image: string;
    location: string;
  };
}

const ChatWindow = memo(
  ({ conversationId, participants = [], onClose, onBack, property }: ChatWindowProps) => {
    const userId = useSelector((state: any) => state.auth?.user?.id);
    const {
      messages,
      onlineUsers,
      typingUsers,
      loading,
      error,
      sendMessage,
      sendTyping,
      markAsRead,
      editMessage,
      deleteMessage,
      addReaction,
      removeReaction,
      isConnected,
    } = useChat(conversationId);

    const messageListRef = useRef<HTMLDivElement>(null);
    const [showPropertyInfo, setShowPropertyInfo] = useState(false);

    // Auto-scroll to latest message
    useEffect(() => {
      if (messageListRef.current) {
        const scrollHeight = messageListRef.current.scrollHeight;
        messageListRef.current.scrollTop = scrollHeight;
      }
    }, [messages]);

    // Mark as read when visible
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            markAsRead();
          }
        },
        { threshold: 0.5 }
      );

      if (messageListRef.current) {
        observer.observe(messageListRef.current);
      }

      return () => observer.disconnect();
    }, [markAsRead]);

    const otherParticipant = participants.find((p) => p._id !== userId);
    const isOtherUserOnline = otherParticipant && onlineUsers.has(otherParticipant._id);
    const isOtherUserTyping = otherParticipant && typingUsers.has(otherParticipant._id);

    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3 flex-1">
            {/* Back button for mobile */}
            {onBack && (
              <button
                onClick={onBack}
                className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Back to conversations"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            {/* Avatar */}
            <div className="relative">
              <img
                src={otherParticipant?.avatar || 'https://via.placeholder.com/40'}
                alt={otherParticipant?.name}
                className="w-10 h-10 rounded-full"
              />
              {isOtherUserOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
              )}
            </div>

            {/* User info */}
            <div>
              <h2 className="font-semibold text-gray-900">{otherParticipant?.name}</h2>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isOtherUserOnline ? 'text-green-600' : 'text-gray-500'}`}>
                  {isOtherUserOnline ? (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online
                    </>
                  ) : (
                    <>Last seen {formatDistanceToNow(new Date(), { addSuffix: true })}</>
                  )}
                </span>
                {isOtherUserTyping && (
                  <span className="text-xs text-primary animate-pulse">typing...</span>
                )}
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Property info button */}
            {property && (
              <button
                onClick={() => setShowPropertyInfo(!showPropertyInfo)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Property details"
              >
                🏠
              </button>
            )}

            {/* Connection status */}
            <div className="text-xs px-2 py-1 rounded-full bg-gray-100">
              {isConnected ? (
                <span className="text-green-600">✓ Connected</span>
              ) : (
                <span className="text-orange-600">⚠ Connecting...</span>
              )}
            </div>

            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Message list */}
            <div
              ref={messageListRef}
              className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
            >
              <MessageList
                messages={messages}
                onlineUsers={onlineUsers}
                currentUserId={userId}
                onReactionAdd={addReaction}
                onReactionRemove={removeReaction}
                onEdit={editMessage}
                onDelete={deleteMessage}
                isLoading={loading}
              />
            </div>

            {/* Input area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <MessageInput
                onSendMessage={sendMessage}
                onTyping={sendTyping}
                disabled={!isConnected}
              />
            </div>
          </div>

          {/* Property info sidebar */}
          {property && showPropertyInfo && (
            <div className="w-72 border-l border-gray-200 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Property Details</h3>

                {/* Property image */}
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-40 object-cover rounded-lg"
                />

                {/* Property info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 line-clamp-2">{property.title}</h4>

                  <div className="space-y-1">
                    <p className="text-lg font-bold text-primary">
                      ₹{property.price?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      📍 {property.location}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <a
                    href={`/properties/${property._id}`}
                    className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                  >
                    View Full Details
                  </a>
                  <button
                    onClick={() => {
                      // Share property in chat
                      sendMessage({
                        type: 'property',
                        property: {
                          propertyId: property._id,
                          title: property.title,
                          price: property.price,
                          location: property.location,
                          image: property.image,
                        },
                      });
                    }}
                    className="block w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
                  >
                    Share in Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
